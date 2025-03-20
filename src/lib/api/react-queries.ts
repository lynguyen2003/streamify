import { 
  useQuery, 
  useInfiniteQuery,
  useQueryClient
} from '@tanstack/react-query';
import { apolloClient } from '@/lib/api/apiSlice';
import { GET_POSTS, GET_USER_BY_ID, GET_LIKED_POSTS, GET_USERS, GET_FRIENDSHIP_STATUS } from '@/graphql/queries';
import { ACCEPT_FRIEND_REQUEST, ADD_FRIEND, BLOCK_USER, CANCEL_FRIEND_REQUEST, REJECT_FRIEND_REQUEST, UNFRIEND, UPDATE_USER } from '@/graphql/mutations';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { IUpdateUser } from '@/types';
import { QUERY_KEYS } from './queriesKeys';
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
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts,
    initialPageParam: null,
    getNextPageParam: (lastPage: any) => 
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
  });
} 

export const useInfiniteUsers = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_USERS],
    queryFn: getInfiniteUsers,
    initialPageParam: null,
    getNextPageParam: (lastPage: any) => 
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
  });
}

/** useQuery */

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById({ userId }),
    enabled: !!userId,
  });
}

export const useGetUserLikedPosts = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_LIKED_POSTS, userId],
    queryFn: () => getLikedPosts({ userId }),
  }); 
}

export const useGetFriendshipStatus = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FRIENDSHIP_STATUS, userId],
    queryFn: () => getFriendshipStatus({ userId })
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
    onCompleted: (variables) => {
      toast.success('Friend request sent successfully');
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.GET_FRIENDSHIP_STATUS, variables.userId],
        refetchType: 'active'
      });
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, variables.userId],
        refetchType: 'active'
      });
    },
    onError: (error) => {
      toast.error(`Failed to send friend request: ${error.message}`);
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
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.GET_FRIENDSHIP_STATUS, data.cancelFriendRequest.recipient._id],
        refetchType: 'active' 
      });
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data.cancelFriendRequest.recipient._id],
        refetchType: 'active'
      });
    },
    onError: (error) => {
      toast.error(`Failed to cancel friend request: ${error.message}`);
    }
  });

  return {
    cancelFriendRequest: (requestId: string) => cancelFriendRequestMutation({ variables: { requestId } }),
    loading,  
    error
  };
}

export const useRejectFriendRequestMutation = () => {
  const queryClient = useQueryClient();
  const [rejectFriendRequestMutation, { loading, error }] = useMutation(REJECT_FRIEND_REQUEST, {
    onCompleted: (data) => {
      toast.success('Friend request rejected successfully');
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.GET_FRIENDSHIP_STATUS, data.rejectFriendRequest.requester._id],
        refetchType: 'active'
      });
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data.rejectFriendRequest.requester._id],
        refetchType: 'active'
      });
    },
    onError: (error) => {
      toast.error(`Failed to reject friend request: ${error.message}`);
    }
  });

  return {
    rejectFriendRequest: (requestId: string) => rejectFriendRequestMutation({ variables: { requestId } }),
    loading,
    error
  };
}

export const useAcceptFriendRequestMutation = () => {
  const queryClient = useQueryClient();
  const [acceptFriendRequestMutation, { loading, error }] = useMutation(ACCEPT_FRIEND_REQUEST, {
    onCompleted: (data) => {
      toast.success('Friend request accepted successfully');  
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.GET_FRIENDSHIP_STATUS, data.acceptFriendRequest.requester._id],
        refetchType: 'active'
      });
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data.acceptFriendRequest.requester._id],
        refetchType: 'active'
      });
      const currentUserId = data.acceptFriendRequest.recipient._id;
      if (currentUserId) {
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.GET_USER_BY_ID, currentUserId],
          refetchType: 'active'
        });
      }
    },
    onError: (error) => {
      toast.error(`Failed to accept friend request: ${error.message}`);
    }
  });

  return {
    acceptFriendRequest: (requestId: string) => acceptFriendRequestMutation({ variables: { requestId } }),
    loading,
    error
  };
}

export const useUnfriendMutation = () => {
  const queryClient = useQueryClient();
  const [unfriendMutation, { loading, error }] = useMutation(UNFRIEND, {
    onCompleted: (data) => {
      toast.success('Friend removed successfully');
      const userId = data;
      if (userId) {
        queryClient.removeQueries({ queryKey: [QUERY_KEYS.GET_FRIENDSHIP_STATUS, userId] });
        
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.GET_FRIENDSHIP_STATUS, userId],
          refetchType: 'active'
        });
        
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
          refetchType: 'active' 
        });
        
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_USER_BY_ID],
          refetchType: 'active'
        });
      }
    },
    onError: (error) => {
      toast.error(`Failed to unfriend: ${error.message}`);
    }
  }); 

  return {
    unfriend: (userId: string) => unfriendMutation({ variables: { userId } }),
    loading,
    error
  };
}

export const useBlockUserMutation = () => {
  const queryClient = useQueryClient();
  const [blockUserMutation, { loading, error }] = useMutation(BLOCK_USER, {
    onCompleted: (data) => {
      toast.success('User blocked successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_FRIENDSHIP_STATUS, data.blockUser.userId] });
    },
  });
  
  return {
    blockUser: (userId: string) => blockUserMutation({ variables: { userId } }),
    loading,
    error
  };
}

