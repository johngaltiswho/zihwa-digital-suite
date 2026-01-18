'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { vendureClient, handleGraphQLError } from './client';
import { LOGIN, LOGOUT, REGISTER_CUSTOMER } from './mutations/auth';
import { GET_ACTIVE_CUSTOMER } from './queries/customer';
import type { Customer, RegisterCustomerInput } from './types';

interface AuthContextType {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (input: RegisterCustomerInput) => Promise<void>;
  refreshCustomer: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the active customer on mount
  const refreshCustomer = useCallback(async () => {
    try {
      const data = await vendureClient.request(GET_ACTIVE_CUSTOMER);
      setCustomer(data.activeCustomer || null);
    } catch (err) {
      // Not logged in, which is fine
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCustomer();
  }, [refreshCustomer]);

  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await vendureClient.request(LOGIN, {
        email,
        password,
        rememberMe,
      });

      if (data.login.__typename === 'CurrentUser') {
        // Login successful, fetch customer data
        await refreshCustomer();
      } else {
        // Handle error result
        const errorMessage = data.login.message || 'Login failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await vendureClient.request(LOGOUT);
      setCustomer(null);
    } catch (err: any) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (input: RegisterCustomerInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await vendureClient.request(REGISTER_CUSTOMER, { input });

      if (data.registerCustomerAccount.__typename === 'Success') {
        // Registration successful
        // Note: Vendure may require email verification before login
        // Check your Vendure config for requireVerification setting
        return;
      } else {
        // Handle error result
        const errorMessage = data.registerCustomerAccount.message || 'Registration failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    customer,
    isLoading,
    isAuthenticated: !!customer,
    error,
    login,
    logout,
    register,
    refreshCustomer,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
