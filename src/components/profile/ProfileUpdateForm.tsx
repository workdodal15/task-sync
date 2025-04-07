import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

// Schema for profile update (only name for now)
const profileUpdateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  // Add password fields here if implementing password change
  // currentPassword: z.string().optional(),
  // newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }).optional(),
  // confirmPassword: z.string().optional(),
});
// Add refinement for password confirmation if needed
// .refine(data => !data.newPassword || data.newPassword === data.confirmPassword, {
//   message: "New passwords don't match",
//   path: ["confirmPassword"],
// })
// .refine(data => !!data.newPassword === !!data.currentPassword, {
//   message: "Current password is required to set a new password",
//   path: ["currentPassword"],
// });

type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;

interface ProfileUpdateFormProps {
  user: User;
}

const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({ user }) => {
  const { updateProfile, isUpdatingProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name || '',
      // currentPassword: '',
      // newPassword: '',
      // confirmPassword: '',
    },
  });

  // Reset form when user prop changes (e.g., after successful update)
  useEffect(() => {
    form.reset({ name: user.name || '' });
  }, [user, form]);

  const onSubmit = async (values: ProfileUpdateFormValues) => {
    setError(null);
    setSuccess(null);

    // Check if name actually changed
    if (values.name === user.name) {
      setError("No changes detected in name.");
      return;
    }

    try {
      // Only pass name for now
      await updateProfile({ name: values.name }); 
      setSuccess("Profile updated successfully!");
      // Optionally reset form fields or specific states here if needed
      // form.reset(); // Resetting based on useEffect now
    } catch (err: any) { 
      setError(err.message || 'Failed to update profile.');
    } 
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Update Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="success"> {/* You might need to define a 'success' variant for Alert */}
            {/* <CheckCircleIcon className="h-4 w-4" /> */}
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} disabled={isUpdatingProfile} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add Password Fields Here if implementing */}
        {/* 
        <FormField name="currentPassword" ... /> 
        <FormField name="newPassword" ... /> 
        <FormField name="confirmPassword" ... /> 
        */}

        <Button type="submit" disabled={isUpdatingProfile}>
          {isUpdatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
          {isUpdatingProfile ? 'Saving Changes...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileUpdateForm; 