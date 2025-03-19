import { gql } from "@apollo/client";

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
        followersCount
        followingCount
        friendsCount
        isActive
        lastLogin
        registrationDate
    }
 }
`;


