import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { loginUser, registerUser, logoutUser, getUserById, verifyOTP } from '@/features/auth/authSlice';
import { decodeToken, isTokenExpired } from '@/lib/utils/jwt';
import { IUser } from '@/types';

type IAuthContext = {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterUserParams) => Promise<void>;
  logout: () => void;
  checkAuthUser: () => Promise<boolean>;
  activateUser: (email: string, token: string) => Promise<boolean>;
}

type RegisterUserParams = {
  email: string;
  password: string;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { token, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const activateUser = async (email: string, token: string): Promise<boolean> => {
    try {
      await dispatch(verifyOTP({ email, token }));
      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  // Login user
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      await dispatch(loginUser({ email, password }));
      await checkAuthUser();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register user
  const register = async (userData: RegisterUserParams): Promise<void> => {
    setIsLoading(true);
    try {
      await dispatch(registerUser({ email: userData.email, password: userData.password }));
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    dispatch(logoutUser());
    setUser(null);
    navigate('/sign-in');
  };

  // Check if user is authenticated
  const checkAuthUser = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
        if (!token || isTokenExpired(token)) {
            setUser(null);
            return false;
        } 

        const decodedToken = decodeToken(token);
        if (!decodedToken) {
            return false;
        }   

        dispatch(getUserById(decodedToken._id));
        return false;
    } catch (error) {
        console.error('Auth check error:', error);
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  // Check authentication status on mount and token change
  useEffect(() => {
    if (token) {
        if (isTokenExpired(token)) {
            dispatch(logoutUser());
            return;
        }

        checkAuthUser();
    } else {
        setUser(null);
    }
  }, [token]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuthUser,
    activateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): IAuthContext => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};