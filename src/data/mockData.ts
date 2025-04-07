
import { Task, TaskEvent, User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://ui-avatars.com/api/?name=John+Admin&background=0D8ABC&color=fff"
  },
  {
    id: "2",
    name: "Jane User",
    email: "user@example.com",
    role: "user",
    avatar: "https://ui-avatars.com/api/?name=Jane+User&background=FF5733&color=fff"
  },
  {
    id: "3",
    name: "Mike Dev",
    email: "mike@example.com",
    role: "user",
    avatar: "https://ui-avatars.com/api/?name=Mike+Dev&background=27AE60&color=fff"
  },
  {
    id: "4",
    name: "Sarah QA",
    email: "sarah@example.com",
    role: "user",
    avatar: "https://ui-avatars.com/api/?name=Sarah+QA&background=8E44AD&color=fff"
  }
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Implement authentication",
    description: "Set up JWT authentication in NestJS backend",
    status: "todo",
    assignedTo: "3",
    createdBy: "1",
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2025-04-01T10:00:00Z",
    priority: "high",
    dueDate: "2025-04-10T23:59:59Z"
  },
  {
    id: "task-2",
    title: "Create dashboard UI",
    description: "Design and implement the main dashboard interface",
    status: "in-progress",
    assignedTo: "2",
    createdBy: "1",
    createdAt: "2025-04-01T11:30:00Z",
    updatedAt: "2025-04-02T09:15:00Z",
    priority: "medium",
    dueDate: "2025-04-08T23:59:59Z"
  },
  {
    id: "task-3",
    title: "Set up WebSocket connections",
    description: "Implement real-time updates with Socket.io",
    status: "review",
    assignedTo: "3",
    createdBy: "1",
    createdAt: "2025-04-02T14:20:00Z",
    updatedAt: "2025-04-04T16:45:00Z",
    priority: "high",
    dueDate: "2025-04-07T23:59:59Z"
  },
  {
    id: "task-4",
    title: "Write unit tests for auth service",
    description: "Create Jest tests for the authentication service",
    status: "done",
    assignedTo: "4",
    createdBy: "3",
    createdAt: "2025-04-03T09:00:00Z",
    updatedAt: "2025-04-05T11:30:00Z",
    priority: "medium",
    dueDate: "2025-04-06T23:59:59Z"
  },
  {
    id: "task-5",
    title: "Implement task assignment feature",
    description: "Allow users to assign tasks to team members",
    status: "todo",
    assignedTo: "2",
    createdBy: "1",
    createdAt: "2025-04-04T13:45:00Z",
    updatedAt: "2025-04-04T13:45:00Z",
    priority: "low",
    dueDate: "2025-04-12T23:59:59Z"
  },
  {
    id: "task-6",
    title: "Add responsive design",
    description: "Make the UI work well on mobile devices",
    status: "in-progress",
    assignedTo: "2",
    createdBy: "1",
    createdAt: "2025-04-04T15:20:00Z",
    updatedAt: "2025-04-05T10:10:00Z",
    priority: "medium",
    dueDate: "2025-04-09T23:59:59Z"
  },
  {
    id: "task-7",
    title: "Set up CI/CD pipeline",
    description: "Configure GitHub Actions for automated deployment",
    status: "todo",
    assignedTo: "3",
    createdBy: "1",
    createdAt: "2025-04-05T09:30:00Z",
    updatedAt: "2025-04-05T09:30:00Z",
    priority: "low",
    dueDate: "2025-04-15T23:59:59Z"
  }
];

export const mockEvents: TaskEvent[] = [
  {
    id: "event-1",
    taskId: "task-2",
    userId: "2",
    action: "status-changed",
    timestamp: "2025-04-02T09:15:00Z",
    metadata: {
      oldStatus: "todo",
      newStatus: "in-progress"
    }
  },
  {
    id: "event-2",
    taskId: "task-3",
    userId: "3",
    action: "status-changed",
    timestamp: "2025-04-04T16:45:00Z",
    metadata: {
      oldStatus: "in-progress",
      newStatus: "review"
    }
  },
  {
    id: "event-3",
    taskId: "task-4",
    userId: "4",
    action: "status-changed",
    timestamp: "2025-04-05T11:30:00Z",
    metadata: {
      oldStatus: "review",
      newStatus: "done"
    }
  }
];

// Helper function to get tasks with user data
export const getTasksWithUsers = (): (Task & { assignedToUser?: User })[] => {
  return mockTasks.map(task => {
    if (task.assignedTo) {
      const user = mockUsers.find(u => u.id === task.assignedTo);
      return {
        ...task,
        assignedToUser: user
      };
    }
    return task;
  });
};

// Helper to get a user by ID
export const getUserById = (id?: string): User | undefined => {
  if (!id) return undefined;
  return mockUsers.find(user => user.id === id);
};
