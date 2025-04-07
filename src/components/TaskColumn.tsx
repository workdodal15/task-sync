import React from "react";
import { Task, TaskStatus } from "@/types";
import TaskCard from "./TaskCard";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Droppable } from "react-beautiful-dnd";
import { LoadingSpinner } from "./LoadingSpinner";

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  searchQuery?: string;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ 
  title, 
  status, 
  tasks, 
  onAddTask,
  onEditTask,
  searchQuery = ""
}) => {
  const getBgColor = (status: TaskStatus) => {
    switch (status) {
      case "todo": return "bg-[hsl(var(--status-todo-fg))]";
      case "in-progress": return "bg-[hsl(var(--status-inprogress-fg))]";
      case "review": return "bg-[hsl(var(--status-review-fg))]";
      case "done": return "bg-[hsl(var(--status-done-fg))]";
    }
  };
  
  const filteredTasks = searchQuery 
    ? tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : tasks;
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={cn("w-3 h-3 rounded-full mr-2", getBgColor(status))}></div>
          <h2 className="font-medium">{title}</h2>
          <span className="ml-2 text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
            {filteredTasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => onAddTask(status)}
        >
          <CirclePlus className="h-5 w-5" />
        </Button>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "bg-secondary/50 p-2 rounded-lg flex-1 overflow-y-auto max-h-[calc(100vh-220px)] transition-colors",
              snapshot.isDraggingOver && "bg-primary/10"
            )}
          >
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24 text-muted-foreground text-sm border border-dashed border-muted rounded-md">
                {searchQuery ? (
                  <p>No matching tasks</p>
                ) : (
                  <>
                    <p>No tasks</p>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => onAddTask(status)}
                    >
                      Add task
                    </Button>
                  </>
                )}
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onEdit={onEditTask} 
                  index={index}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
