import React, { useState, useMemo } from "react";
import { useTasks } from "@/contexts/TaskContext";
import DashboardLayout, { PriorityFilter, SortBy, SortOrder } from "@/components/DashboardLayout";
import TaskColumn from "@/components/TaskColumn";
import TaskFormDialog from "@/components/tasks/form/TaskFormDialog";
import { Task, TaskStatus } from "@/types";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

const Dashboard = () => {
  const { tasks: allTasks, isLoading, changeTaskStatus } = useTasks();
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [initialStatus, setInitialStatus] = useState<TaskStatus | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleAddTask = (status: TaskStatus) => {
    setSelectedTask(undefined);
    setInitialStatus(status);
    setTaskFormOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setInitialStatus(undefined);
    setTaskFormOpen(true);
  };
  
  const handleOpenChange = (open: boolean) => {
    setTaskFormOpen(open);
    if (!open) {
      setSelectedTask(undefined);
      setInitialStatus(undefined);
    }
  };
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    if (destination.droppableId !== source.droppableId) {
      const newStatus = destination.droppableId as TaskStatus;
      changeTaskStatus(draggableId, newStatus);
    }
  };
  
  const handleSearch = (query: string) => setSearchQuery(query);
  const handlePriorityFilterChange = (value: PriorityFilter) => setPriorityFilter(value);
  const handleSortByChange = (value: SortBy) => setSortBy(value);
  const handleSortOrderChange = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  const getProcessedTasksByStatus = useMemo(() => {
    const priorityOrder: Record<string, number> = { low: 1, medium: 2, high: 3 };

    let filteredTasks = allTasks;

    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (priorityFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }

    filteredTasks.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          comparison = (priorityOrder[a.priority] ?? 0) - (priorityOrder[b.priority] ?? 0);
          break;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'createdAt':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : comparison * -1;
    });

    const groupedTasks = {
      todo: [] as Task[],
      'in-progress': [] as Task[],
      review: [] as Task[],
      done: [] as Task[],
    };

    filteredTasks.forEach(task => {
      if (groupedTasks[task.status]) {
        groupedTasks[task.status].push(task);
      }
    });

    return groupedTasks;

  }, [allTasks, searchQuery, priorityFilter, sortBy, sortOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <DashboardLayout 
      onNewTask={() => handleAddTask("todo")} 
      onSearch={handleSearch}
      priorityFilter={priorityFilter}
      onPriorityFilterChange={handlePriorityFilterChange}
      sortBy={sortBy}
      onSortByChange={handleSortByChange}
      sortOrder={sortOrder}
      onSortOrderChange={handleSortOrderChange}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(getProcessedTasksByStatus) as TaskStatus[]).map(status => (
            <TaskColumn
              key={status}
              title={status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              status={status}
              tasks={getProcessedTasksByStatus[status]}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
            />
          ))}
        </div>
      </DragDropContext>
      
      <TaskFormDialog
        open={taskFormOpen}
        onOpenChange={handleOpenChange}
        initialTask={selectedTask}
        initialStatus={initialStatus}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
