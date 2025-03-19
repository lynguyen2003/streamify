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
  saved: IUser[];
  viewCount: number;
  likeCount: number;
  saveCount: number;
  commentCount: number;
  type: string;
  mentions: IUser[];
  privacy: string;
  audio: IAudio;
  duration: number;
  expiresAt: string;
  storyViews: IUser[];
  createdAt: string;
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
