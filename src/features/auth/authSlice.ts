import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../types';

const initialState: IUser = {
  id: '',
  name: '',
  email: '',
  imageUrl: '',
  bio: '',
  username: '',
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
  },
});

export default authSlice.reducer;