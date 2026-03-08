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
import {
  LOGIN,
  LOGOUT,
  REGISTER_CUSTOMER,
  REQUEST_PASSWORD_RESET,
  RESET_PASSWORD,
} from './mutations/auth';
import { GET_ACTIVE_CUSTOMER } from './queries/customer';
import type { Customer, RegisterCustomerInput } from './types';

interface LoginResponse {
  login: {
    __typename: 'CurrentUser' | 'InvalidCredentialsError' | 'NativeAuthStrategyError';
    message?: string;
  };
}

interface RegisterResponse {
  registerCustomerAccount: {
    __typename: 'Success' | 'MissingPasswordError' | 'PasswordValidationError' | 'NativeAuthStrategyError';
    message?: string;
  };
}

interface RequestPasswordResetResponse {
  requestPasswordReset: {
    __typename: 'Success' | 'NativeAuthStrategyError';
    message?: string;
  };
}

interface ResetPasswordResponse {
  resetPassword: {
    __typename:
      | 'CurrentUser'
      | 'PasswordResetTokenInvalidError'
      | 'PasswordResetTokenExpiredError'
      | 'NativeAuthStrategyError';
    message?: string;
  };
}

interface AuthContextType {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (input: RegisterCustomerInput) => Promise<void>;
  requestPasswordReset: (emailAddress: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
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
      const data = await vendureClient.request(GET_ACTIVE_CUSTOMER) as { activeCustomer: Customer | null };
      setCustomer(data.activeCustomer || null);
    } catch {
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
      }) as LoginResponse;

      if (data.login.__typename === 'CurrentUser') {
        // Login successful, fetch customer data
        await refreshCustomer();
      } else {
        // Handle error result
        const errorMessage = data.login.message || 'Login failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
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
    } catch (err) {
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
      const data = await vendureClient.request(REGISTER_CUSTOMER, { input }) as RegisterResponse;

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
    } catch (err) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (emailAddress: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = (await vendureClient.request(REQUEST_PASSWORD_RESET, {
        emailAddress,
      })) as RequestPasswordResetResponse;

      if (data.requestPasswordReset.__typename !== 'Success') {
        const errorMessage = data.requestPasswordReset.message || 'Failed to request password reset';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = (await vendureClient.request(RESET_PASSWORD, {
        token,
        password,
      })) as ResetPasswordResponse;

      if (data.resetPassword.__typename !== 'CurrentUser') {
        const errorMessage = data.resetPassword.message || 'Failed to reset password';
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      await refreshCustomer();
    } catch (err) {
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
    requestPasswordReset,
    resetPassword,
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
