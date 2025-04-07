import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData'; // Import mock users
import { toast } from 'sonner'; // Mock sonner

// Mock the toast function from sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// A simple test component that uses the context
const TestComponent: React.FC = () => {
  const { user, login, logout, register, isAuthenticated, isLoading } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Logged In' : 'Logged Out'}</div>
      <div data-testid="loading-status">{isLoading ? 'Loading' : 'Idle'}</div>
      {user && <div data-testid="user-email">{user.email}</div>}
      <button onClick={() => login('user@example.com', 'password')}>Login</button>
      <button onClick={() => login('wrong@example.com', 'wrong')}>Login Fail</button>
      <button onClick={() => register('New User', 'new@example.com', 'password')}>Register</button>
      <button onClick={() => register('Existing User', 'user@example.com', 'password')}>Register Fail</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Reset mocks and localStorage before each test
    jest.clearAllMocks();
    localStorageMock.clear();
    // Reset mockUsers if needed, assuming it might be mutated by register
    // You might need a deep copy mechanism if mockUsers is complex
    // For this example, we'll assume simple reset if needed, but be cautious
    // mockUsers = [...initialMockUsers]; // If mutation happens
  });

  it('should initialize with no user and not authenticated', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    expect(screen.queryByTestId('user-email')).toBeNull();
  });

  it('should handle successful login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('loading-status')).toHaveTextContent('Loading');

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('user@example.com');
    expect(localStorageMock.getItem('user')).toContain('user@example.com');
    expect(toast.success).toHaveBeenCalledWith('Logged in successfully!');
    expect(screen.getByTestId('loading-status')).toHaveTextContent('Idle');
  });

  it('should handle failed login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Login Fail').click();
    });

    expect(screen.getByTestId('loading-status')).toHaveTextContent('Loading');

    await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Invalid email or password");
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    expect(localStorageMock.getItem('user')).toBeNull();
    expect(screen.getByTestId('loading-status')).toHaveTextContent('Idle');
  });

  it('should handle successful registration', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
        screen.getByText('Register').click();
    });

    expect(screen.getByTestId('loading-status')).toHaveTextContent('Loading');

    await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Registered successfully! Please log in.');
    });
    // Check if user state remains null after registration as per current logic
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    expect(screen.getByTestId('loading-status')).toHaveTextContent('Idle');
    // Optional: Check if mockUsers array was updated (if testing mutation)
  });

   it('should handle failed registration (email exists)', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Register Fail').click(); // Attempt to register with existing email
    });

    expect(screen.getByTestId('loading-status')).toHaveTextContent('Loading');

    await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Email already exists.");
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    expect(screen.getByTestId('loading-status')).toHaveTextContent('Idle');
  });

  it('should handle logout', async () => {
    // First, log in
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    act(() => {
      screen.getByText('Login').click();
    });
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
    });

    // Then, log out
    act(() => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    expect(screen.queryByTestId('user-email')).toBeNull();
    expect(localStorageMock.getItem('user')).toBeNull();
    expect(toast.info).toHaveBeenCalledWith('Logged out successfully');
  });

  it('should load user from localStorage on mount', () => {
    const testUser = mockUsers[0];
    localStorageMock.setItem('user', JSON.stringify(testUser));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Need to wait for useEffect to run
     waitFor(() => {
       expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
       expect(screen.getByTestId('user-email')).toHaveTextContent(testUser.email);
    });
  });

}); 