export interface TravelPost {
  id?: string;
  title: string;
  story: string;
  tips: string;
  photos: string[];
  posterName: string;
  route: string;
  city: string;
  createdAt: string;
  likes: number;
  posterPhoto: string;
  comments: Comment[];
  timestamp?: string;
}

export interface Comment {
  _id?: string;
  author: string;
  content: string;
  authorPhoto: string;
  createdAt: string;
}
