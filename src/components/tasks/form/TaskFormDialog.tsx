import React, { useEffect } from "react";
import { Task, TaskStatus } from "@/types";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/contexts/TaskContext";
import TaskFormFields from "./TaskFormFields";
import { Loader2 } from "lucide-react";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTask?: Task;
  initialStatus?: TaskStatus;
}

const defaultTask: Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy" | "assignedToUser"> = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
};

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  open,
  onOpenChange,
  initialTask,
  initialStatus,
}) => {
  const { addTask, updateTask, isMutating } = useTasks();
  
  const [formData, setFormData] = React.useState<Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy" | "assignedToUser">>(defaultTask);
  const [date, setDate] = React.useState<Date | undefined>();
  
  useEffect(() => {
    if (initialTask) {
      const { id, createdAt, updatedAt, createdBy, assignedToUser, ...formDataFromTask } = initialTask;
      setFormData(formDataFromTask);
      if (initialTask.dueDate) {
        setDate(new Date(initialTask.dueDate));
      }
    } else if (initialStatus) {
      setFormData({...defaultTask, status: initialStatus});
      setDate(undefined);
    } else {
      setFormData(defaultTask);
      setDate(undefined);
    }
  }, [initialTask, initialStatus, open]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      dueDate: date ? date.toISOString() : undefined
    };
    
    try {
      if (initialTask) {
        await updateTask(initialTask.id, taskData);
      } else {
        await addTask(taskData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialTask ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <TaskFormFields
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            date={date}
            setDate={setDate}
          />
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isMutating}>
              {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isMutating
                ? (initialTask ? "Updating..." : "Creating...")
                : (initialTask ? "Update Task" : "Create Task")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
