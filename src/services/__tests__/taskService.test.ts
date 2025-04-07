import { Task, User } from '@/types';
import * as taskService from '../taskService';
import { mockTasks, mockUsers } from '@/data/mockData';

// Keep a copy of the original mock data to reset between tests
let originalMockTasks: Task[];
let originalMockUsers: User[];

// Mock the mockData module if necessary, or just reset it
// jest.mock('@/data/mockData', () => ({
//   mockTasks: [...originalMockTasks], // Use copies
//   mockUsers: [...originalMockUsers],
//   getTasksWithUsers: jest.fn(() => /* return mocked value */),
//   getUserById: jest.fn((id) => originalMockUsers.find(u => u.id === id)),
// }));

// Helper to reset data before each test
beforeEach(() => {
  // Deep copy original data before each test run
  originalMockTasks = JSON.parse(JSON.stringify(require('@/data/mockData').mockTasks));
  originalMockUsers = JSON.parse(JSON.stringify(require('@/data/mockData').mockUsers));

  // Reset the imported arrays directly (use with caution, module caching might affect this)
  mockTasks.length = 0;
  Array.prototype.push.apply(mockTasks, originalMockTasks);
  mockUsers.length = 0;
  Array.prototype.push.apply(mockUsers, originalMockUsers);
});

describe('taskService', () => {

  describe('fetchTasks', () => {
    it('should return tasks with assigned user details', async () => {
      const tasks = await taskService.fetchTasks();
      expect(tasks).toBeInstanceOf(Array);
      expect(tasks.length).toBe(originalMockTasks.length);
      // Check if a task that should have a user has it
      const taskWithUser = tasks.find(t => t.id === 'task-1');
      expect(taskWithUser?.assignedToUser).toBeDefined();
      expect(taskWithUser?.assignedToUser?.id).toBe('3');
      expect(taskWithUser?.assignedToUser?.name).toBe('Mike Dev'); // Name from originalMockUsers
    });
  });

  describe('fetchTaskById', () => {
    it('should return a specific task with user details', async () => {
      const taskId = 'task-2';
      const task = await taskService.fetchTaskById(taskId);
      expect(task).toBeDefined();
      expect(task?.id).toBe(taskId);
      expect(task?.title).toBe('Create dashboard UI');
      expect(task?.assignedToUser).toBeDefined();
      expect(task?.assignedToUser?.id).toBe('2');
    });

    it('should throw an error if task not found', async () => {
      const taskId = 'non-existent-task';
      await expect(taskService.fetchTaskById(taskId)).rejects.toThrow('Task not found');
    });
  });

  describe('createTask', () => {
    it('should add a new task to the mock data', async () => {
      const initialLength = mockTasks.length;
      const newTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'assignedToUser' | 'status'> = {
        title: 'New Test Task',
        description: 'Test description',
        priority: 'low',
        createdBy: '1', // Assuming user ID 1 exists
      };
      const createdTask = await taskService.createTask(newTaskData);

      expect(createdTask).toBeDefined();
      expect(createdTask.id).toMatch(/^task-/);
      expect(createdTask.title).toBe(newTaskData.title);
      expect(createdTask.status).toBe('todo'); // Default status
      expect(mockTasks.length).toBe(initialLength + 1);
      // Verify the task was actually added to the *current* mockTasks array
      const foundTask = mockTasks.find(t => t.id === createdTask.id);
      expect(foundTask).toBeDefined();
      expect(foundTask?.title).toBe(newTaskData.title);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const taskId = 'task-1';
      const updates: Partial<Task> = {
        title: 'Updated Task Title',
        status: 'in-progress',
      };
      const originalTask = mockTasks.find(t => t.id === taskId);
      const updatedAtBefore = originalTask?.updatedAt;

      const updatedTask = await taskService.updateTask(taskId, updates);

      expect(updatedTask).toBeDefined();
      expect(updatedTask.id).toBe(taskId);
      expect(updatedTask.title).toBe(updates.title);
      expect(updatedTask.status).toBe(updates.status);
      expect(updatedTask.updatedAt).not.toBe(updatedAtBefore);

      // Verify the update in the *current* mockTasks array
      const foundTask = mockTasks.find(t => t.id === taskId);
      expect(foundTask?.title).toBe(updates.title);
      expect(foundTask?.status).toBe(updates.status);
    });

    it('should throw an error if task to update is not found', async () => {
      const taskId = 'non-existent-task';
      await expect(taskService.updateTask(taskId, { title: 'Update Fail' })).rejects.toThrow('Task not found');
    });
  });

  describe('deleteTask', () => {
    it('should remove a task from mock data', async () => {
      const taskId = 'task-3';
      const initialLength = mockTasks.length;
      expect(mockTasks.find(t => t.id === taskId)).toBeDefined(); // Ensure it exists first

      await taskService.deleteTask(taskId);

      expect(mockTasks.length).toBe(initialLength - 1);
      expect(mockTasks.find(t => t.id === taskId)).toBeUndefined();
    });

    it('should throw an error if task to delete is not found', async () => {
      const taskId = 'non-existent-task';
      // Check length before potential deletion
      const initialLength = mockTasks.length;
      await expect(taskService.deleteTask(taskId)).rejects.toThrow('Task not found');
      // Verify length hasn't changed
      expect(mockTasks.length).toBe(initialLength);
    });
  });
}); 