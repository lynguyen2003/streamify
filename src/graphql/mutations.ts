import { gql } from "@apollo/client";

/**
 * Mutation to update a user
 * @param {string} input - The input to update the user
 * @returns {Promise<User>} - A promise that resolves to the updated user
 */

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
        _id
        bio
        email
        imageUrl
        phone
        username
    }
}
`;

/**
 * Mutation to add a friend
 * @param {string} userId - The id of the user to add as a friend
 * @returns {Promise<Friend>} - A promise that resolves to the added friend
 */

export const ADD_FRIEND = gql`
  mutation AddFriend($userId: String!) {
    addFriend(userId: $userId){
      _id
      requester {
        _id
      }
      recipient {
        _id
      }
      status
      createdAt
    }
  }
`;

export const CANCEL_FRIEND_REQUEST = gql`
  mutation CancelFriendRequest($requestId: String!) {
    cancelFriendRequest(requestId: $requestId) {
      _id
      requester {
        _id
      }
      recipient {
        _id
      }
      status
      createdAt
    }
  }
`;

export const ACCEPT_FRIEND_REQUEST = gql`
  mutation AcceptFriendRequest($requestId: String!) {
    acceptFriendRequest(requestId: $requestId) {
      _id
      requester {
        _id
      }
      recipient {
        _id
      }
      status
      createdAt
    }
  }
`;

export const REJECT_FRIEND_REQUEST = gql`
  mutation RejectFriendRequest($requestId: String!) {
  rejectFriendRequest(requestId: $requestId) {
    _id
    createdAt
    requester {
      _id
    }
    recipient {
      _id
    }
    status
    updatedAt
  }
}
`;

export const UNFRIEND = gql`
  mutation Unfriend($userId: String!) {
    unfriend(userId: $userId)
  }
`;

export const BLOCK_USER = gql`
  mutation BlockUser($userId: String!) {
    blockUser(userId: $userId)
  }
`;

export const UNBLOCK_USER = gql`
  mutation UnblockUser($userId: String!) {
    unblockUser(userId: $userId)
  }
`;





