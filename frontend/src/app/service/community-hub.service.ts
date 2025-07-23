import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { TravelPost, Comment } from './../model/community-post.model';

// const baseurl = 'http://localhost:5000/api/community'; // Adjust the base URL as needed

@Injectable({
  providedIn: 'root'
})
export class CommunityHubService {
  private apiUrl = 'http://localhost:5000/api/community';// Replace with your actual API endpoint
  private postsSubject = new BehaviorSubject<TravelPost[]>([]);
  public posts$ = this.postsSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Get all travel posts
  getAllPosts(): Observable<TravelPost[]> {
    return this.http.get<TravelPost[]>(`${this.apiUrl}/posts`);
  }

  // Create a new travel post
  createPost(postData: any): Observable<TravelPost> {
    return this.http.post<TravelPost>(`${this.apiUrl}/posts`, postData);
  }

  // Upload images for a post
  uploadImages(files: FileList): Observable<string[]> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    return this.http.post<string[]>(`${this.apiUrl}/upload`, formData);
  }

  // Like a post
  likePost(postId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts/${postId}/like`, {});
  }

  // Add comment to a post
  addComment(postId: string, comment: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/posts/${postId}/comments`, { content: comment });
  }

  // Get comments for a post
  getComments(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/posts/${postId}/comments`);
  }

  // Search posts by location or keyword
  searchPosts(query: string): Observable<TravelPost[]> {
    return this.http.get<TravelPost[]>(`${this.apiUrl}/posts/search?q=${query}`);
  }

  // Get posts by specific route
  getPostsByRoute(route: string): Observable<TravelPost[]> {
    return this.http.get<TravelPost[]>(`${this.apiUrl}/posts/route/${route}`);
  }

  // Get user's own posts
  getUserPosts(userId: string): Observable<TravelPost[]> {
    return this.http.get<TravelPost[]>(`${this.apiUrl}/posts/user/${userId}`);
  }

  // Update posts in the local state
  updatePosts(posts: TravelPost[]): void {
    this.postsSubject.next(posts);
  }

  // Get current posts from local state
  getCurrentPosts(): TravelPost[] {
    return this.postsSubject.value;
  }
}