import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import postReducer from '../features/post/postSlice';
export const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    post: postReducer,
});