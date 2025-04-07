import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, LogIn } from 'lucide-react'; // Changed icon

const LoginPage: React.FC = () => {
  return (
    // Use a full-height container with a subtle pattern or gradient
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Side: Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title Area */}
          <div className="text-center">
            <LogIn className="mx-auto h-12 w-auto text-indigo-600" /> {/* New Icon */}
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to Task Sync Hub
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Welcome back! Enter your details below.
            </p>
          </div>
          
          {/* Login Form Card (Removed Card for a cleaner look, form handles structure)*/}
          <LoginForm />
          
          <p className="mt-10 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Task Sync Hub. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Right Side: Branding/Graphic (Hidden on smaller screens) */}
      <div className="hidden lg:block bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
        {/* You can add an image, illustration, or branding text here */} 
        <div className="flex flex-col justify-start mt-[30%] items-center h-full text-white">
           <CheckSquare className="h-24 w-24 mb-6 opacity-90" /> 
          <h1 className="text-4xl font-bold mb-4">Collaboration Simplified</h1>
          <p className="text-lg text-indigo-100 max-w-sm text-center">
            Manage your tasks efficiently and collaborate seamlessly with your team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;