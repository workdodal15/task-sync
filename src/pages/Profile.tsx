import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirecting
import ProfileUpdateForm from '@/components/profile/ProfileUpdateForm'; // Import the new form component
import { LoadingSpinner } from "@/components/LoadingSpinner"; // Import loader
import DashboardLayout from "@/components/DashboardLayout"; // Import layout

const ProfilePage: React.FC = () => {
  // Get isLoading state as well for initial load
  const { user, logout, isLoading } = useAuth(); // Get logout function as well
  const navigate = useNavigate(); // For redirecting after logout

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  // Function to get initials for Avatar fallback
  const getInitials = (name: string | undefined): string => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Show loader while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If loading is done and still no user, redirect (though ProtectedRoute should handle this)
  if (!user) {
     navigate('/login');
     return null; // Return null while navigating
  }

  return (
    // Wrap content in DashboardLayout for consistent navigation/header
    <DashboardLayout>
      <div className="container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-card text-card-foreground p-6 rounded-lg shadow-md border">
          <h1 className="text-3xl font-bold mb-6 border-b pb-4">User Profile</h1>
          
          <div className="space-y-6">
            {/* User Info Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-2xl font-semibold">{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground capitalize">Role: {user.role}</p>
              </div>
            </div>
            
            {/* Update Profile Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Update Profile</h2>
              {/* Remove placeholder and render the form */}
              <ProfileUpdateForm user={user} /> 
            </div>
            
            {/* Logout Section */}
            <div>
               <h2 className="text-xl font-semibold mb-4 border-b pb-2">Account Actions</h2>
              <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage; 