import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, UserPlus } from 'lucide-react'; // Changed icon

const RegisterPage: React.FC = () => {
  return (
    // Use the same two-column layout as LoginPage
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Side: Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title Area */}
          <div className="text-center">
            <UserPlus className="mx-auto h-12 w-auto text-indigo-600" /> {/* New Icon */}
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Create your Account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join Task Sync Hub today!
            </p>
          </div>
          
          {/* Register Form (Removed Card) */}
          <RegisterForm />
          
          <p className="mt-10 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Task Sync Hub. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Right Side: Branding/Graphic (Consistent with Login Page) */}
      <div className="hidden lg:block bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
        <div className="flex flex-col justify-center items-center h-full text-white">
           <CheckSquare className="h-24 w-24 mb-6 opacity-90" /> 
          <h1 className="text-4xl font-bold mb-4">Get Organized</h1>
          <p className="text-lg text-indigo-100 max-w-sm text-center">
            Start managing your projects and tasks effortlessly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 