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
  likes?: number;
  comments: Comment[];
}

export interface Comment {
  id?: string;
  author: string;
  content: string;
  createdAt: string;
}
