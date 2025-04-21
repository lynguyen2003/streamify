import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      _id
      username
      email
      phone
      bio
      imageUrl
    }
  }
`;

export const CREATE_POST = gql`
  mutation AddPost($input: AddPostInput!) {
    addPost(input: $input) {
      _id
      caption
      mediaUrls
      tags
      location
      type
      privacy
      mentions {
        _id
        username
      }
      createdAt
      author {
        _id
        username
        imageUrl
      }
    }
  }
`;

export const TOGGLE_LIKE_POST = gql`
  mutation ToggleLikePost($id: String!) {
    toggleLikePost(id: $id) {
      _id
      likeCount
      likes {
        _id
      }
    }
  }
`;

export const TOGGLE_SAVE_POST = gql`
  mutation ToggleSavePost($id: String!) {
    toggleSavePost(id: $id) {
      _id
      saveCount
      saves {
        _id
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: String!) {
    deletePost(id: $id)
  }
`;

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

export const FOLLOW_USER = gql`
  mutation FollowUser($userId: String!) {
    follow(userId: $userId)
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($userId: String!) {
    unfollow(userId: $userId)
  }
`;

// ========== COMMENTS ==========

export const ADD_COMMENT = gql`
  mutation AddComment($input: CommentInput!) {
    addComment(input: $input) {
      _id
      content
      author {
        _id
        username
        imageUrl
      }
      createdAt
    }
  }
`;

export const REPLY_COMMENT = gql`
  mutation AddComment($input: CommentInput!) {
    addComment(input: $input) {
      _id
      content
      author {
        _id
        username
        imageUrl
      }
      createdAt
    }
  }
`;

export const LIKE_COMMENT = gql`
  mutation ToggleLikeComment($toggleLikeCommentId: String!) {
    toggleLikeComment(id: $toggleLikeCommentId) {
      _id
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: String!) {
    deleteComment(id: $commentId) {
      _id
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    authUser(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
    registerUser(email: $email, password: $password) {
      token
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation VerifyOTP($email: String!, $token: String!) {
    verifyOTP(email: $email, token: $token) {
      token
    }
  }
`;

export const SEND_OTP_TO_EMAIL = gql`
  mutation SendOTPToEmail($email: String!) {
    sendOTPToEmail(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!, $token: String!, $newPassword: String!) {
    resetPassword(email: $email, token: $token, newPassword: $newPassword)
  }
`;

// ========== CHAT ==========

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation($input: CreateConversationInput!) {
    createConversation(input: $input) {
      _id
      participants {
        _id
        username
        imageUrl
      }
      type
      name
      lastMessage {
        _id
        content
        contentType
        createdAt
      }
      createdBy {
        _id
        username
      }
      createdAt
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      _id
      content
      contentType
      mediaUrl
      sender {
        _id
        username
        imageUrl
      }
      createdAt
    }
  }
`;

export const MARK_CONVERSATION_AS_READ = gql`
  mutation MarkConversationAsRead($conversationId: String!) {
    markConversationAsRead(conversationId: $conversationId)
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($messageId: String!) {
    deleteMessage(messageId: $messageId)
  }
`;

export const DELETE_CONVERSATION = gql`
  mutation DeleteConversation($conversationId: String!) {
    deleteConversation(conversationId: $conversationId)
  }
`;
















