import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apolloClient } from '@/lib/api/apiSlice';
import { IUser } from '@/types';
import { LOGIN_MUTATION, REGISTER_MUTATION, VERIFY_OTP, SEND_OTP_TO_EMAIL, RESET_PASSWORD } from '@/graphql/mutations';
import { GET_USER_BY_ID } from '@/graphql/queries';

type AuthState = {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: credentials,
      });
      
      const { accessToken, refreshToken } = data.authUser;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      return { token: accessToken };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string }) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: REGISTER_MUTATION,
        variables: userData,
      });
      
      const { token } = data.registerUser;
      
      return { token };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const sendOTPToEmail = createAsyncThunk(
  'auth/sendOTPToEmail',
  async (email: string) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: SEND_OTP_TO_EMAIL,
        variables: { email },
      });
      return data.sendOTPToEmail;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (input: { email: string; token: string; newPassword: string }) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: RESET_PASSWORD,
        variables: input,
      });
      return data.resetPassword;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);


export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (input: { email: string; token: string }) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: VERIFY_OTP,
        variables: input,
      });
      return data.verifyOTP;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return true;
  }
);

export const getUserById = createAsyncThunk(
  'auth/getUserById',
  async (userId: string) => {
    const { data } = await apolloClient.query({ query: GET_USER_BY_ID, variables: { userId } });
    return data.user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      });

    // Get User By Id
    builder
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Get user by id failed';
      });

    // Send OTP To Email
    builder
      .addCase(sendOTPToEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTPToEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendOTPToEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Send OTP to email failed';
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 