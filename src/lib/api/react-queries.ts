import { 
  useQuery, 
  useInfiniteQuery 
} from '@tanstack/react-query';
import { apolloClient } from '@/lib/api/apiSlice';
import { GET_LIKED_POSTS, GET_POSTS } from '@/graphql/queries/post';
import { GET_USERS, GET_USER_BY_ID } from '@/graphql/queries/user';

// ========== POSTS ==========

async function getInfinitePosts({ pageParam = null }: { pageParam: string | null }) {
  const { data } = await apolloClient.query({
    query: GET_POSTS,
    variables: { cursor: pageParam, limit: 2 }
  });
  return data.posts;
}

// ========== USERS ==========

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

// =====================================
// ========== USE REACT QUERY ==========
// =====================================


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

