
export interface ISong {
  _id: string;
  title: string;
  imageUrl: string;
  artist: string;
  audioUrl: string;
  duration: number;
  albumId?: string; 
  createdAt: Date;
  updatedAt: Date;
}

export interface IAlbum {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
  songs: ISong[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  _id: string;
  fullName: string;
  imageUrl: string;
  clerkId: string;
  favouriteSongs: ISong[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlayList {
  _id: string;
  name : string;
  songs : ISong[];
  owner : IUser;
  createdAt: Date;
  updatedAt: Date;
}