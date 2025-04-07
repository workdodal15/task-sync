import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link
import { Mail, Lock, Loader2, Info, ChevronRight } from 'lucide-react'; // Import icons
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error display
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { mockUsers } from "@/data/mockData"; // Import the mock users data

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { login } = useAuth(); // Get login function from context
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      // Replace with actual API call via authService/AuthContext
      console.log('Attempting login with:', values);
      await login(values.email, values.password);
      console.log('Login successful');
      navigate('/'); // Redirect to dashboard on success
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to set demo credentials
  const setDemoCredentials = (demoEmail: string) => {
    form.setValue('email', demoEmail);
    form.setValue('password', 'password');
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Login Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <FormControl>
                    <Input 
                      placeholder="Email address" 
                      {...field} 
                      type="email" 
                      className="pl-10 h-11 border border-input bg-background rounded-md focus-visible:ring-1 focus-visible:ring-ring" 
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-xs pt-1"/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <FormControl>
                    <Input 
                      placeholder="Password" 
                      {...field} 
                      type="password" 
                      className="pl-10 h-11 border border-input bg-background rounded-md focus-visible:ring-1 focus-visible:ring-ring" 
                    />
                  </FormControl>
                </div>
                <div className="text-right pt-1">
                  <Link to="#" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormMessage className="text-xs pt-1" />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-11 mt-2" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
          <p className="text-center text-sm text-muted-foreground pt-3">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </Form>

      {/* Demo accounts section */}
      <div className="relative flex items-center my-4">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-3 text-gray-400 text-xs">or continue with demo</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>
      
      <div className="bg-muted rounded-xl p-4 border border-border">
        <div className="flex items-center mb-3">
          <Info className="h-4 w-4 text-primary mr-2" />
          <p className="text-sm font-medium">Demo Accounts</p>
        </div>
        <div className="space-y-2">
          {mockUsers.map((user) => (
            <div 
              key={user.id} 
              className="flex justify-between items-center p-2 bg-card hover:bg-accent/50 rounded-lg cursor-pointer transition-colors border border-border"
              onClick={() => setDemoCredentials(user.email)}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-foreground font-medium">{user.email}</span>
              </div>
              <div className="flex items-center text-primary">
                <span className="text-xs mr-2">password: "password"</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;