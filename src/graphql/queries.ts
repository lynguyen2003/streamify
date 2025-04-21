import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query Posts($cursor: String, $limit: Int) {
  posts(cursor: $cursor, limit: $limit) {
    edges {
      node {
        _id
        audio {
          artist
          name
          url
        }
        author {
          _id
          email
          username
          imageUrl
        }
        caption
        commentCount
        duration
        expiresAt
        likeCount
        likes {
          _id
        }
        location
        mediaUrls
        mentions {
          _id
          username
        }
        privacy
        saveCount
        saves {
          _id
        }
        tags
        type
        viewCount
        createdAt
        updatedAt
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;

export const GET_POST_BY_ID = gql`
  query Post($postId: String!) {
    post(id: $postId) {
      _id
      audio {
        artist
        name
        url
      }
      author {
        _id
        email
        username
        imageUrl
      }
      caption
      commentCount
      comments {
        _id
        content
        author {
          _id
          username
          imageUrl
        }
        likeCount
        createdAt
      }
      duration
      expiresAt
      likeCount
      likes {
        _id
      }
      location
      mediaUrls
      mentions {
        _id
        username
      }
      privacy
      saveCount
      saves {
        _id
      }
      tags
      type
      viewCount
      createdAt
      updatedAt
    }
  }
`;

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
    likes {
      _id
    }
    saveCount
    saves {
      _id
    }
    location
    mediaUrls
    mentions {
      username
    }
    viewCount
    tags
  }  
} 
`;

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

export const GET_USER_BY_ID = gql`
  query User($userId: String!) {
    user(id: $userId) {
        _id
        bio
        email
        phone
        username
        imageUrl
        posts {
          _id
          mediaUrls
          caption
          location
          tags
          type
          privacy
          likeCount
          saveCount
          commentCount
          viewCount
          createdAt
          updatedAt
        }
        followersCount
        followingCount
        friendsCount
        isActive
        lastLogin
        registrationDate
    }
 }
`;

export const GET_FRIENDSHIP_STATUS = gql`
  query FriendshipStatus($userId: String!) {
    friendshipStatus(userId: $userId) {
        _id
        createdAt
        requester {
          _id
        }
        recipient {
          _id
        }
        status
    }
}
`;

export const IS_FOLLOWING = gql`
  query IsFollowing($userId: String!) {
    isFollowing(userId: $userId)
  }
`;

export const GET_COMMENTS = gql`
  query Comments($postId: ID!) {
    comments(postId: $postId) {
      _id
      content
      author {
        _id
        username
        imageUrl
      }
      replies {
        _id
      }
      likeCount
      likes {
        _id
      }
      createdAt
    }
  }
`;

export const GET_REPLIES_COMMENT = gql`
  query Comments($postId: ID!, $parentCommentId: ID,) {
    comments(postId: $postId, parentCommentId: $parentCommentId) {
      _id
      author {
        imageUrl
        username
      }
      content
      likeCount
      likes {
        _id
      }
    }
  }
`;

export const SEARCH_POSTS = gql`
  query SearchPosts($searchQuery: String!) {
    searchPosts(searchQuery: $searchQuery) {
      _id
      audio {
        artist
        name
        url
      }
      author {
        _id
        email
        username
        imageUrl
      }
      caption
      commentCount
      likeCount
      location
      mediaUrls
      mentions {
        _id
        username
      }
      saveCount
      tags
      type
      viewCount
      createdAt
      updatedAt
    }
  }
`;
