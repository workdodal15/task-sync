import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Task, TaskEvent, TaskStatus, User } from "@/types";
// Remove mock data imports if service handles fetching directly
// import { getTasksWithUsers, mockEvents, mockUsers } from "@/data/mockData"; 
import { fetchTasks, createTask as createTaskService, updateTask as updateTaskService, deleteTask as deleteTaskService, assignTask as assignTaskService, fetchTaskById } from "@/services/taskService"; // Import actual service functions
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { mockUsers, mockEvents } from "@/data/mockData"; // Keep mockUsers for now if needed for getUserById or events

interface TaskContextType {
  tasks: Task[];
  events: TaskEvent[];
  isLoading: boolean; // For initial fetch
  isMutating: boolean; // For add, update, delete, assign, status change
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy" | "assignedToUser">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'assignedToUser'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  changeTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  assignTask: (id: string, userId: string) => Promise<void>;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getUserById: (id?: string) => User | undefined;
  refetchTasks: () => void; // Add a refetch function
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<TaskEvent[]>([]); // Keep mock events for now
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const { user } = useAuth();

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
      setEvents(mockEvents); // Still using mock events
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to load tasks.");
      setTasks([]); // Clear tasks on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const refetchTasks = () => {
    loadTasks();
  };

  // Helper to generate timestamp
  const generateTimestamp = () => new Date().toISOString();

  // Helper to create events (remains largely the same, uses mock users)
  const createEvent = useCallback((taskId: string, action: TaskEvent["action"], metadata = {}) => {
    if (!user) return;

    const newEvent: TaskEvent = {
      id: `event-${Math.floor(Math.random() * 10000)}`,
      taskId,
      userId: user.id,
      action,
      timestamp: generateTimestamp(),
      metadata
    };

    setEvents(prev => [newEvent, ...prev]);
    showRealtimeNotification(newEvent); // Keep notification simulation
  }, [user]); // Added user dependency

  // Add a new task
  const addTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy" | "assignedToUser">) => {
    if (!user) {
      toast.error("You must be logged in to add tasks.");
      return;
    }
    setIsMutating(true);
    try {
      // Service function expects createdBy
      const dataToSend = { ...taskData, createdBy: user.id }; 
      const newTask = await createTaskService(dataToSend);
      // Add user details if missing from backend response (using mock for now)
      const newTaskWithUser = { ...newTask, assignedToUser: getUserById(newTask.assignedTo) };
      setTasks(prev => [newTaskWithUser, ...prev]);
      createEvent(newTask.id, "created");
      toast.success("Task created successfully!");
    } catch (error: any) {
      console.error("Failed to create task:", error);
      toast.error(`Failed to create task: ${error.message || 'Server error'}`);
    } finally {
      setIsMutating(false);
    }
  };

  // Update a task
  const updateTask = async (id: string, updates: Partial<Omit<Task, 'assignedToUser'>>) => {
    setIsMutating(true);
    const originalTasks = [...tasks]; // Store original state for optimistic revert
    
    // Optimistic update (optional but good for UX)
    setTasks(prev => prev.map(task =>
        task.id === id
            ? { ...task, ...updates, updatedAt: generateTimestamp(), assignedToUser: getUserById(updates.assignedTo ?? task.assignedTo) } // Update assigned user optimistically
            : task
    ));

    try {
      const updatedTask = await updateTaskService(id, updates);
      // Ensure local state matches backend response
      setTasks(prev => prev.map(task =>
          task.id === id
              ? { ...updatedTask, assignedToUser: getUserById(updatedTask.assignedTo) }
              : task
      ));
      createEvent(id, "updated", updates);
      toast.success("Task updated successfully!");
    } catch (error: any) {
      console.error("Failed to update task:", error);
      toast.error(`Failed to update task: ${error.message || 'Server error'}`);
      setTasks(originalTasks); // Revert optimistic update on error
    } finally {
      setIsMutating(false);
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    setIsMutating(true);
    const originalTasks = [...tasks];
    
    // Optimistic update
    setTasks(prev => prev.filter(task => task.id !== id));
    
    try {
      await deleteTaskService(id);
      // No need to update state again if successful
      createEvent(id, "deleted"); // Create event after successful deletion
      toast.success("Task deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      toast.error(`Failed to delete task: ${error.message || 'Server error'}`);
      setTasks(originalTasks); // Revert optimistic update
    } finally {
      setIsMutating(false);
    }
  };

  // Change task status (uses updateTask internally)
  const changeTaskStatus = async (id: string, status: TaskStatus) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const oldStatus = task.status;
    // Call the main updateTask function
    await updateTask(id, { status }); 
    // Note: createEvent is handled within updateTask now, 
    // but we might want a specific 'status-changed' event?
    // If keeping separate event:
    // createEvent(id, "status-changed", { oldStatus, newStatus: status });
  };

  // Assign task to user (uses updateTask internally)
  const assignTask = async (id: string, userId: string) => {
    await updateTask(id, { assignedTo: userId });
     // Note: createEvent is handled within updateTask now,
    // but we might want a specific 'assigned' event?
    // If keeping separate event:
    // createEvent(id, "assigned", { userId });
  };

  // Get tasks filtered by status (no change needed)
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  // Get user by ID (still uses mockUsers)
  const getUserById = useCallback((id?: string): User | undefined => {
    if (!id) return undefined;
    return mockUsers.find(user => user.id === id);
  }, []); // Added useCallback

  // Simulate WebSocket real-time notification (no change needed, uses mockUsers)
  const showRealtimeNotification = useCallback((event: TaskEvent) => {
    const task = tasks.find(t => t.id === event.taskId);
    const eventUser = mockUsers.find(u => u.id === event.userId);

    if (!task || !eventUser) return;

    setTimeout(() => {
      switch (event.action) {
        case "created":
          toast(`${eventUser.name} created: ${task.title}`);
          break;
        case "updated":
           // Check what was updated to make a more specific message
           const updates = event.metadata;
           let updateMsg = Object.keys(updates).join(', ');
           if (updateMsg.includes('status')) updateMsg = `status to ${updates.status}`;
           if (updateMsg.includes('assignedTo')) {
             const assignedUser = getUserById(updates.assignedTo);
             updateMsg = `assignment to ${assignedUser?.name ?? 'Unassigned'}`;
           }
          toast(`${eventUser.name} updated ${task.title} (${updateMsg})`);
          break;
        case "deleted": // Added case for deletion
           toast(`${eventUser.name} deleted task: ${task.title}`);
           break;
        // Remove assignment and status change cases if handled by 'updated'
        // case "assigned": ...
        // case "status-changed": ...
      }
    }, 500);
  }, [tasks, getUserById]); // Added dependencies

  return (
    <TaskContext.Provider value={{
      tasks,
      events,
      isLoading,
      isMutating,
      addTask,
      updateTask,
      deleteTask,
      changeTaskStatus,
      assignTask,
      getTasksByStatus,
      getUserById,
      refetchTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
