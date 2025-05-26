
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