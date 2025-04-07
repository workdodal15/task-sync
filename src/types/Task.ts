import { User } from './User';

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo?: User;
  createdBy: User;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
} 