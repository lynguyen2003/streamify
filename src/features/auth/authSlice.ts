import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { gql } from '@apollo/client';
import { apolloClient } from '@/lib/api/apiSlice';

type AuthState = {
  user: string | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: '',
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// GraphQL Mutations
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    authUser(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
    registerUser(email: $email, password: $password) {
      accessToken
      refreshToken
    }
}
`;

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
      
      const { accessToken, refreshToken } = data.registerUser;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      return { token: accessToken };
    } catch (error) {
      console.error('Register error:', error);
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
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
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
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 