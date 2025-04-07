import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { mockUsers } from "@/data/mockData";
import { toast } from "sonner";
import { authService } from "@/services/authService";

interface UpdateProfileData {
  name?: string;
  // Add password fields if implementing password change
  // currentPassword?: string;
  // newPassword?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  isLoading: boolean;
  isUpdatingProfile: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse saved user", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock authentication
        const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (foundUser && password === "password") { // All users have the same password for demo
          setUser(foundUser);
          localStorage.setItem("user", JSON.stringify(foundUser));
          toast.success("Logged in successfully!");
          setIsLoading(false);
          resolve();
        } else {
          toast.error("Invalid email or password");
          setIsLoading(false);
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  };
  
  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call for registration
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if email already exists (mock check)
        const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
          toast.error("Email already exists.");
          setIsLoading(false);
          reject(new Error("Email already exists"));
          return;
        }
        
        // Mock user creation
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          role: 'user',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        };
        
        // Add to mock users (this won't persist without backend)
        // Ensure mockUsers is mutable or handle this differently
        mockUsers.push(newUser);
        console.log("Mock Users after registration:", mockUsers);
        
        toast.success("Registered successfully! Please log in.");
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };
  
  const updateProfile = async (data: UpdateProfileData): Promise<void> => {
    if (!user) throw new Error("Not authenticated");
    
    setIsUpdatingProfile(true);
    try {
      // Currently only supporting name update with mock service
      const updateData: Partial<User> = {};
      if (data.name) updateData.name = data.name;
      
      if (Object.keys(updateData).length === 0) {
          toast.info("No changes detected.")
          return; // No actual update to perform
      }
      
      // Call actual service (using mock for now)
      const updatedUser = await authService.updateProfile(user.id, updateData);
      
      // Update state and local storage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully!");

    } catch (err: any) {
      console.error("Profile update failed:", err);
      toast.error(err.message || "Failed to update profile.");
      throw err; // Re-throw for the form to handle if needed
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      logout, 
      updateProfile,
      isLoading,
      isUpdatingProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
