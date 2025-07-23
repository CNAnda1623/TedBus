export interface TravelPost {
  id?: string;
  title: string;
  route: string;
  city: string;
  story: string;
  tips: string;
  photos: string[];
  author: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  content: string;
  author?: string;
  timestamp?: string;
}
