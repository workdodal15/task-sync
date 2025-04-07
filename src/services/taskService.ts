import { Task, User } from '@/types';
import { mockTasks, mockUsers, getTasksWithUsers, getUserById } from '@/data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Mock API functions for tasks

export const fetchTasks = async (): Promise<(Task & { assignedToUser?: User })[]> => {
  await delay(500); // Simulate network latency
  console.log('Fetching tasks...');
  // In a real app, this would be an API call
  // For now, return mock data with user details embedded
  return getTasksWithUsers();
};

export const fetchTaskById = async (taskId: string): Promise<(Task & { assignedToUser?: User }) | undefined> => {
  await delay(300);
  console.log(`Fetching task ${taskId}...`);
  const task = mockTasks.find(t => t.id === taskId);
  if (!task) {
    throw new Error('Task not found');
  }
  const assignedToUser = getUserById(task.assignedTo);
  return { ...task, assignedToUser };
};

export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'assignedToUser'>): Promise<Task> => {
  await delay(400);
  console.log('Creating task...', taskData);
  const newTask: Task = {
    ...taskData,
    id: `task-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: taskData.status || 'todo', // Default status
  };
  mockTasks.push(newTask);
  // In a real app, you'd likely return the created task from the API
  return newTask;
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
  await delay(400);
  console.log(`Updating task ${taskId}...`, updates);
  const taskIndex = mockTasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  const updatedTask = {
    ...mockTasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  mockTasks[taskIndex] = updatedTask;
  return updatedTask;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await delay(300);
  console.log(`Deleting task ${taskId}...`);
  const taskIndex = mockTasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  mockTasks.splice(taskIndex, 1);
  // No return value needed for delete usually
};

export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    console.log('Mock Get Tasks');
    await delay(300);
    return [...mockTasks]; // Return a copy
  },

  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>, creator: User): Promise<Task> => {
    console.log('Mock Create Task:', taskData.title);
    await delay(400);
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdBy: creator,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTasks.push(newTask);
    return newTask;
  },

  updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    console.log('Mock Update Task:', taskId, updates);
    await delay(200);
    const taskIndex = mockTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates, updatedAt: new Date().toISOString() };
    return mockTasks[taskIndex];
  },

  deleteTask: async (taskId: string): Promise<void> => {
    console.log('Mock Delete Task:', taskId);
    await delay(500);
    const initialLength = mockTasks.length;
    const taskIndex = mockTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    mockTasks.splice(taskIndex, 1);
      },

  assignTask: async (taskId: string, userId: string): Promise<Task> => {
    console.log('Mock Assign Task:', taskId, 'to', userId);
    await delay(250);
    const taskIndex = mockTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    // In a real app, you'd fetch the user details based on userId
    const assignedUser = userId === mockUser.id ? mockUser : (userId === mockAdmin.id ? mockAdmin : undefined);
    if (!assignedUser) {
      throw new Error('User not found');
    }
    mockTasks[taskIndex] = { ...mockTasks[taskIndex], assignedTo: assignedUser, updatedAt: new Date().toISOString() };
    return mockTasks[taskIndex];
  },
}; 