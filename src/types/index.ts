
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo?: string;
  assignedToUser?: User;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface TaskEvent {
  id: string;
  taskId: string;
  userId: string;
  action: 'created' | 'updated' | 'assigned' | 'status-changed';
  timestamp: string;
  metadata: Record<string, any>;
}
