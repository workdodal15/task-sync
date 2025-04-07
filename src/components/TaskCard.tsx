import React from "react";
import { Task, TaskStatus, User } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlarmClock, 
  Calendar, 
  MoreHorizontal, 
  ArrowUpCircle, 
  Circle, 
  CheckCircle2, 
  Clock,
  GripVertical,
  Trash2,
  Pencil,
  Loader2,
  Dot
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useTasks } from "@/contexts/TaskContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Draggable } from "react-beautiful-dnd";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  index: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, index }) => {
  const { deleteTask, changeTaskStatus, getUserById, isMutating } = useTasks();
  
  const [isCurrentCardMutating, setIsCurrentCardMutating] = React.useState(false);
  
  const assignedUser = getUserById(task.assignedTo);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-gray-500";
    }
  };
  
  const getPriorityDotClass = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };
  
  const renderStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return <Circle className="h-4 w-4 text-slate-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "review":
        return <ArrowUpCircle className="h-4 w-4 text-yellow-500" />;
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };
  
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return "bg-[hsl(var(--status-todo-bg))] text-[hsl(var(--status-todo-fg))]";
      case "in-progress":
        return "bg-[hsl(var(--status-inprogress-bg))] text-[hsl(var(--status-inprogress-fg))]";
      case "review":
        return "bg-[hsl(var(--status-review-bg))] text-[hsl(var(--status-review-fg))]";
      case "done":
        return "bg-[hsl(var(--status-done-bg))] text-[hsl(var(--status-done-fg))]";
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  const handleDelete = async () => {
    setIsCurrentCardMutating(true);
    try {
      await deleteTask(task.id);
    } catch (error) {
      setIsCurrentCardMutating(false);
    }
  };
  
  const handleChangeStatus = async (status: TaskStatus) => {
    setIsCurrentCardMutating(true);
    try {
      await changeTaskStatus(task.id, status);
    } finally {
      setIsCurrentCardMutating(false);
    }
  };
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "mb-3",
            snapshot.isDragging && "opacity-75"
          )}
        >
          <Card className="task-card w-full border shadow-sm hover:shadow-md transition-all group relative">
            {(isMutating && isCurrentCardMutating) && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-md">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            <CardHeader className="pb-2 pt-3 px-3 flex flex-row justify-between items-start">
              <div className="flex items-center space-x-2">
                <Badge className={cn("status-badge capitalize text-xs font-medium", getStatusColor(task.status))}>
                  {task.status.replace("-", " ")}
                </Badge>
              </div>
              <div className="flex items-center">
                <div 
                  {...provided.dragHandleProps}
                  className="cursor-grab active:cursor-grabbing mr-1 opacity-25 group-hover:opacity-100 transition-opacity duration-150"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isMutating && isCurrentCardMutating}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(task)} disabled={isMutating && isCurrentCardMutating}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleChangeStatus("todo")} disabled={isMutating && isCurrentCardMutating}>
                      <Circle className="h-4 w-4 mr-2" /> To Do
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleChangeStatus("in-progress")} disabled={isMutating && isCurrentCardMutating}>
                      <Clock className="h-4 w-4 mr-2" /> In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleChangeStatus("review")} disabled={isMutating && isCurrentCardMutating}>
                      <ArrowUpCircle className="h-4 w-4 mr-2" /> Review
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleChangeStatus("done")} disabled={isMutating && isCurrentCardMutating}>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Done
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500"
                      onClick={handleDelete}
                      disabled={isMutating && isCurrentCardMutating}
                    >
                      {isMutating && isCurrentCardMutating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      {isMutating && isCurrentCardMutating ? "Deleting..." : "Delete Task"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pb-2 px-3">
              <h3 className="font-semibold text-base leading-snug truncate mb-1 group-hover:text-primary transition-colors">{task.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 break-words">{task.description}</p>
            </CardContent>
            <CardFooter className="pt-2 pb-3 px-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                {assignedUser && (
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={assignedUser.avatar} />
                          <AvatarFallback>{assignedUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Assigned to: {assignedUser.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <div className="flex items-center">
                  <span className={cn("w-2 h-2 rounded-full mr-1.5", getPriorityDotClass(task.priority))}></span>
                  <span className="capitalize text-muted-foreground">
                    {task.priority}
                  </span>
                </div>
              </div>
              {task.dueDate && (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
