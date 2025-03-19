import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUser } from "@/types";
import { gql } from "@apollo/client";
import { apolloClient } from "@/lib/api/apiSlice";
import { GET_USER_BY_ID } from "@/graphql/queries/user";

type UserState = {
  user: IUser | null;
  isLoading: boolean;
  error: string | undefined;
};

type UpdateUserInput = {
  email: string;
  username: string;
  phone: string;
  bio: string;
  imageUrl: string;
};

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: undefined,
};


// GraphQL Mutations

const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      _id
      username
      bio
      email
      imageUrl
      phone
    }
  }
`;  

// createAsyncThunk
export const getUserById = createAsyncThunk(
    'user/getUserById',
    async (id: string) => {
        const { data } = await apolloClient.query({ query: GET_USER_BY_ID, variables: { id } });
        return data.user;
    }
);

export const updateUser = createAsyncThunk(
    'user/updateUser', 
    async (input: UpdateUserInput) => {
    try {
        const { data } = await apolloClient.mutate({
        mutation: UPDATE_USER,
        variables: { input },
        }); 
        return data.updateUser;
    } catch (error) {
        throw error;
    }
});


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
        },
    },
    extraReducers: (builder) => {
      // Get User By Id
      builder.addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      });
      builder.addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      });
      builder.addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

      // Update User
        builder.addCase(updateUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
        });
        builder.addCase(updateUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
    },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
