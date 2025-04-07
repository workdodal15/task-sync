import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '@/services/taskService';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Helper function to get initials for Avatar fallback
const getInitials = (name: string | undefined): string => {
  if (!name) return "?";
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const TaskList: React.FC = () => {
  const { data: tasks, error, isLoading, isError } = useQuery({
    queryKey: ['tasks'], // Unique key for this query
    queryFn: fetchTasks, // The function to fetch data
    // Optional: Add staleTime, cacheTime, refetch options etc.
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // cacheTime: 15 * 60 * 1000, // 15 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load tasks: {error?.message || 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!tasks || tasks.length === 0) {
    return <p>No tasks found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">Task List</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>
                 <Badge variant={task.status === 'done' ? 'default' : 'secondary'} className="capitalize">
                  {task.status.replace('-', ' ')}
                </Badge>
             </TableCell>
              <TableCell className="capitalize">{task.priority}</TableCell>
              <TableCell>
                {task.assignedToUser ? (
                   <div className="flex items-center space-x-2">
                     <Avatar className="h-6 w-6">
                       <AvatarImage src={task.assignedToUser.avatar} alt={task.assignedToUser.name} />
                       <AvatarFallback>{getInitials(task.assignedToUser.name)}</AvatarFallback>
                     </Avatar>
                     <span>{task.assignedToUser.name}</span>
                   </div>
                ) : (
                  <span className="text-gray-500">Unassigned</span>
                )}
              </TableCell>
              <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskList; 