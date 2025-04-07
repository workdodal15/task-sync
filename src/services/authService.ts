import { User, UserRole } from '@/types';

// Mock implementation - replace with actual API calls

// Simulate a delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<{ user: User; token: string }> => {
    console.log('Mock Login:', credentials.email);
    await delay(500);
    // In a real app, this would call the backend API
    // For now, return mock data using the correct User structure (name, lowercase role)
    if (credentials.email === 'user@example.com' && credentials.password === 'password') {
      const mockUser: User = {
        id: 'user1',
        name: 'Test User',
        email: 'user@example.com',
        role: 'user',
        avatar: 'https://ui-avatars.com/api/?name=Test+User&background=random'
      };
      return { user: mockUser, token: 'mock-jwt-token-user' };
    } else if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
      const mockAdmin: User = {
        id: 'admin1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=random'
      };
      return { user: mockAdmin, token: 'mock-jwt-token-admin' };
    } else {
      throw new Error('Invalid credentials');
    }
  },

  register: async (userData: Omit<User, 'id' | 'role' | 'avatar'> & { password: string }): Promise<{ user: User; token: string }> => {
    console.log('Mock Register:', userData.email);
    await delay(500);
    // Simulate successful registration using the correct User structure (name, lowercase role)
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`
    };
    return { user: newUser, token: `mock-jwt-token-${newUser.id}` };
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    console.log('Mock Update Profile:', userId, data);
    await delay(300);
    // Find the mock user to update (assuming mockUsers is accessible or passed in)
    // This part requires access to the mockUsers array, which might need restructuring
    // For demonstration, we'll create a placeholder updated user:
    const placeholderCurrentUser: User = {
      id: userId,
      name: 'Original Name',
      email: 'original@example.com',
      role: 'user'
    };
    const updatedUser: User = {
      ...placeholderCurrentUser,
      ...data,
      id: userId,
      role: data.role && ['admin', 'user'].includes(data.role) ? data.role : placeholderCurrentUser.role,
      avatar: data.name
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`
        : placeholderCurrentUser.avatar,
    };
    return updatedUser;
  },
}; 