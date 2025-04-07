
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SelectField from "./SelectField";
import DatePickerField from "./DatePickerField";
import { Task, TaskStatus } from "@/types";
import { mockUsers } from "@/data/mockData";

interface TaskFormFieldsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  date,
  setDate
}) => {
  const statusOptions = [
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];

  const userOptions = mockUsers.map(user => ({
    value: user.id,
    label: user.name
  }));

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task description"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          id="status"
          label="Status"
          value={formData.status}
          onValueChange={(value) => handleSelectChange("status", value)}
          options={statusOptions}
          placeholder="Select status"
        />
        
        <SelectField
          id="assignedTo"
          label="Assign To"
          value={formData.assignedTo || ""}
          onValueChange={(value) => handleSelectChange("assignedTo", value)}
          options={userOptions}
          placeholder="Select user"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          id="priority"
          label="Priority"
          value={formData.priority}
          onValueChange={(value) => handleSelectChange("priority", value)}
          options={priorityOptions}
          placeholder="Select priority"
        />
        
        <DatePickerField
          date={date}
          setDate={setDate}
          label="Due Date"
        />
      </div>
    </>
  );
};

export default TaskFormFields;
