export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IAudio = {
  name: string;
  artist: string;
  url: string;
};

export type IPost = {
  _id: string;
  author: IUser;
  caption: string;
  tags: string[];
  location: string;
  mediaUrls: string[];
  likes: IUser[];
  saves: IUser[];
  viewCount: number;
  likeCount: number;
  saveCount: number;
  commentCount: number;
  comments?: IComment[];
  type: string;
  mentions: IUser[];
  privacy: string;
  audio: IAudio;
  duration: number;
  expiresAt: string;
  storyViews: IUser[];
  createdAt: string;
}

export type ICreatePost = {
  caption: string
  mediaUrls: string[]
  type: string
  location: string
  tags: string[]
  mentions: string[]
  privacy: string
  audio: IAudio
  duration: number
}

export type IUser = {
  _id: string;
  email: string;
  username: string;
  phone: string;
  imageUrl: string;
  isAdmin: boolean;
  isActive: boolean;
  registrationDate: string;
  lastLogin: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  friendsCount: number;
  posts: IPost[];
};

export type IUpdateUser = {
  email: string;
  username: string;
  phone: string;
  imageUrl: string;
  bio: string;
}

export type IComment = {
  _id: string;
  post: string;
  author: IUser;
  content: string;
  parentComment?: string | null;
  replies?: IComment[];
  likes: IUser[];
  createdAt: string;
  updatedAt: string;
}

export type ICommentInput = {
  content: string;
  mentions: string[];
  parentCommentId?: string | null;
  postId: string;
}

export type IMessage = {
  _id: string;
  sender: IUser;
  content: string;
  contentType: string;
  mediaUrl: string | null;
  readBy: IUser[];
  conversationId: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
};

export type IConversation = {
  _id: string;
  participants: IUser[];
  type: string;
  name: string | null;
  lastMessage: IMessage | null;
  createdBy: IUser;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  unreadCount: number;
};

export type ICreateConversation = {
  participantIds: string[];
  type?: string;
  name?: string;
  initialMessage?: string;
};

export type ISendMessage = {
  conversationId: string;
  content: string;
  contentType?: string;
  mediaUrl?: string;
};
