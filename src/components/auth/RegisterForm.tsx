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
import { Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react'; // Import icons
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const { register } = useAuth(); // Assuming register function exists in context
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      // Replace with actual API call via authService/AuthContext
      console.log('Attempting registration with:', values);
      await register(values.name, values.email, values.password);
      console.log('Registration successful');
      navigate('/login'); // Redirect to login page on success
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Registration Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <FormControl>
                  <Input placeholder="Full Name" {...field} className="pl-10 h-11 border border-input bg-background rounded-md focus-visible:ring-1 focus-visible:ring-ring" />
                </FormControl>
              </div>
              <FormMessage className="text-xs pt-1"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <FormControl>
                  <Input placeholder="Email address" {...field} type="email" className="pl-10 h-11 border border-input bg-background rounded-md focus-visible:ring-1 focus-visible:ring-ring" />
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
                  <Input placeholder="Password" {...field} type="password" className="pl-10 h-11 border border-input bg-background rounded-md focus-visible:ring-1 focus-visible:ring-ring" />
                </FormControl>
              </div>
              <FormMessage className="text-xs pt-1" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full h-11 mt-2" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
        <p className="text-center text-sm text-muted-foreground pt-3">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default RegisterForm;
