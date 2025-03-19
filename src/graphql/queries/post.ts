import { gql } from '@apollo/client';

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
