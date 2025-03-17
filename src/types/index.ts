export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};

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
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};
