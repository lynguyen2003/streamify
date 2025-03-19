import { 
  useQuery, 
  useInfiniteQuery,
  useQueryClient
} from '@tanstack/react-query';
import { apolloClient } from '@/lib/api/apiSlice';
import { GET_POSTS, GET_USER_BY_ID, GET_LIKED_POSTS, GET_USERS, GET_FRIENDSHIP_STATUS } from '@/graphql/queries';
import { ADD_FRIEND, CANCEL_FRIEND_REQUEST, UPDATE_USER } from '@/graphql/mutations';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { IUpdateUser } from '@/types';

// ========== POSTS ==========

async function getInfinitePosts({ pageParam = null }: { pageParam: string | null }) {
  const { data } = await apolloClient.query({
    query: GET_POSTS,
    variables: { cursor: pageParam, limit: 2 }
  });
  return data.posts;
}
// ===========================
// ========== USERS ==========
// ===========================

/** QUERIES FUNCTIONS */

async function getInfiniteUsers({ pageParam = null }: { pageParam: string | null }) {
  const { data } = await apolloClient.query({
    query: GET_USERS,
    variables: { cursor: pageParam, limit: 5 }
  });
  return data.users;
}

async function getUserById({ userId }: { userId: string }) {
  const { data } = await apolloClient.query({
    query: GET_USER_BY_ID,
    variables: { userId }
  });
  return data.user;
}

async function getLikedPosts({ userId }: { userId: string }) {
  const { data } = await apolloClient.query({
    query: GET_LIKED_POSTS,
    variables: { userId }
  });
  return data.likedPosts;
}

async function getFriendshipStatus({ userId }: { userId: string }) {
  const { data } = await apolloClient.query({
    query: GET_FRIENDSHIP_STATUS,
    variables: { userId }
  });
  return data.friendshipStatus;
}

// =====================================
// ========== USE REACT QUERY ==========
// =====================================

/** useInfiniteQuery */

export const useInfinitePosts = () => {
  return useInfiniteQuery({
    queryKey: ['getInfinitePosts'],
    queryFn: getInfinitePosts,
    initialPageParam: null,
    getNextPageParam: (lastPage: any) => 
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
  });
} 

export const useInfiniteUsers = () => {
  return useInfiniteQuery({
    queryKey: ['getInfiniteUsers'],
    queryFn: getInfiniteUsers,
    initialPageParam: null,
    getNextPageParam: (lastPage: any) => 
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
  });
}

/** useQuery */

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: ['getUserById', userId],
    queryFn: () => getUserById({ userId }),
    enabled: !!userId,
  });
}

export const useGetUserLikedPosts = (userId: string) => {
  return useQuery({
    queryKey: ['getUserLikedPosts', userId],
    queryFn: () => getLikedPosts({ userId }),
  }); 
}

export const useGetFriendshipStatus = (userId: string) => {
  return useQuery({
    queryKey: ['getFriendshipStatus', userId],
    queryFn: () => getFriendshipStatus({ userId }),
    enabled: !!userId,
  });
}

/** useMutation */

export const useUpdateUserMutation = () => {
  const [updateUserMutation, { loading, error }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      toast.success('User updated successfully');
    },
    onError: () => {
      toast.error('Failed to update user');
    }
  });
  
  return {
    updateUser: (input: IUpdateUser) => updateUserMutation({ variables: { input } }),
    loading,
    error
  };
}

export const useAddFriendMutation = () => {
  const queryClient = useQueryClient();
  const [addFriendMutation, { loading, error }] = useMutation(ADD_FRIEND, {
    onCompleted: (data) => {
      toast.success('Friend request sent successfully');
      queryClient.setQueryData(['getFriendshipStatus', data.addFriend.userId], {
        status: 'pending'
      });
    },
    onError: () => {
      toast.error('Failed to send friend request');
    }
  });

  return {
    addFriend: (userId: string) => addFriendMutation({ variables: { userId } }),
    loading,  
    error
  };
}

export const useCancelFriendRequestMutation = () => {
  const queryClient = useQueryClient();
  const [cancelFriendRequestMutation, { loading, error }] = useMutation(CANCEL_FRIEND_REQUEST, {
    onCompleted: (data) => {
      toast.success('Friend request cancelled successfully');
      queryClient.setQueryData(['getFriendshipStatus', data.cancelFriendRequest.userId], {
        status: 'rejected'
      });
    },
    onError: () => {
      toast.error('Failed to cancel friend request');
    }
  });

  return {
    cancelFriendRequest: (userId: string) => cancelFriendRequestMutation({ variables: { userId } }),
    loading,
    error
  };
}   

