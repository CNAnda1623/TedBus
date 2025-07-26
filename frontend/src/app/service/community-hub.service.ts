import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { TravelPost, Comment } from './../model/community-post.model';

@Injectable({
  providedIn: 'root'
})
export class CommunityHubService {
  private apiUrl = 'https://tedbus-sxrx.onrender.com/api/community';  // Your backend API base
  private postsSubject = new BehaviorSubject<TravelPost[]>([]);
  public posts$ = this.postsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ✅ Get all travel posts
  getAllPosts(): Observable<TravelPost[]> {
    return this.http.get<TravelPost[]>(`${this.apiUrl}/posts`);
  }

  // ✅ Upload images to Supabase via backend
  uploadImages(files: FileList): Observable<{ imageUrls: string[] }> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);  // must match multer field name
    }

    console.log('Uploading files to:', `${this.apiUrl}/upload`);
    return this.http.post<{ imageUrls: string[] }>(`${this.apiUrl}/upload`, formData);
  }

  // ✅ Create a new post with image URLs
  createPost(postData: TravelPost): Observable<TravelPost> {
    console.log('Sending post to backend:', postData);
    return this.http.post<TravelPost>(`${this.apiUrl}/posts`, postData);
  }

  // ✅ Like a post
  likePost(postId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts/${postId}/like`, {});
  }

  // ✅ Add comment to a post
  addComment(postId: string, comment: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/posts/${postId}/comments`, { content: comment });
  }

  // ✅ Get comments for a post
  getComments(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/posts/${postId}/comments`);
  }

  // ✅ Search posts by query
  searchPosts(query: string): Observable<TravelPost[]> {
    return this.http.get<TravelPost[]>(`${this.apiUrl}/posts/search?q=${query}`);
  }

  // ✅ Get posts by route
  getPostsByRoute(route: string): Observable<TravelPost[]> {
    return this.http.get<TravelPost[]>(`${this.apiUrl}/posts/route/${route}`);
  }

  // ✅ Get user’s own posts
  getUserPosts(userId: string): Observable<TravelPost[]> {
    return this.http.get<TravelPost[]>(`${this.apiUrl}/posts/user/${userId}`);
  }

  // ✅ Update local state
  updatePosts(posts: TravelPost[]): void {
    this.postsSubject.next(posts);
  }

  // ✅ Access current posts
  getCurrentPosts(): TravelPost[] {
    return this.postsSubject.value;
  }
}
