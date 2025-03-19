import { IPost } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

type PostState = {
    posts: IPost[];
    isLoading: boolean;
    error: string | undefined;
};
const initialState: PostState = {
    posts: [],
    isLoading: false,
    error: undefined,
};

// GraphQL Query

// GraphQL Mutations

// createAsyncThunk

// Reducer

const postSlice = createSlice({ 
    name: 'post',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
        },
    },
    extraReducers: (builder) => {
    },
});
export const { clearError } = postSlice.actions;
export default postSlice.reducer;
