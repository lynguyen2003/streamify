import { gql } from '@apollo/client';

// ========== POSTS ==========

export const GET_POSTS = gql`
  query Posts($cursor: String, $limit: Int) {
  posts(cursor: $cursor, limit: $limit) {
    edges {
      node {
        _id
        author {
          _id
          username
          imageUrl
        }
        caption
        commentCount
        likeCount
        location
        mediaUrls
        mentions {
          username
        }
        saveCount
        viewCount
        tags
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;

// ========== LIKED POSTS ==========

export const GET_LIKED_POSTS = gql`
  query LikedPosts($userId: String!) {
  likedPosts(userId: $userId) {
    _id
    author {
      _id
      username
      imageUrl
    }
    caption
    commentCount
    likeCount
    location
    mediaUrls
    mentions {
      username
    }
    saveCount
    viewCount
    tags
  }  
} 
`;

// ========== USERS ==========

export const GET_USERS = gql`
  query Users($cursor: String, $limit: Int) {
    users(cursor: $cursor, limit: $limit) {
      edges {
        node {
          _id
          bio
          email
          followersCount
          imageUrl
          username
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

// ========== USER BY ID ==========

export const GET_USER_BY_ID = gql`
  query User($userId: String!) {
    user(id: $userId) {
        _id
        bio
        email
        phone
        username
        imageUrl
        followersCount
        followingCount
        friendsCount
        isActive
        lastLogin
        registrationDate
    }
 }
`;

// ========== FRIEND REQUESTS ==========

export const GET_FRIENDSHIP_STATUS = gql`
  query FriendshipStatus($userId: String!) {
    friendshipStatus(userId: $userId) {
        _id
        createdAt
        status
    }
}
`;
