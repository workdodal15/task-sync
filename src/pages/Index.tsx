import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "./Dashboard";
import { TaskProvider } from "@/contexts/TaskContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import LoginPage from "./Login";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return (
    <TaskProvider>
      <Dashboard />
    </TaskProvider>
  );
};

export default Index;
