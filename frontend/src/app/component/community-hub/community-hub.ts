import { Component, OnInit } from '@angular/core';
import { CommunityHubService } from '../../service/community-hub.service';
import { TravelPost, Comment } from './../../model/community-post.model';

@Component({
  selector: 'app-community-hub',
  templateUrl: './community-hub.html',
  styleUrls: ['./community-hub.css'],
  standalone: false,
})
export class CommunityHub implements OnInit {
  loggedInUser: any = null;
  newComment = '';
  currentPostId: string | null = null;
  isloggedIn: boolean = false;
  showCreateForm: boolean = false;
  travelPosts: TravelPost[] = [];

  // Form data
  newPost = {
    title: '',
    story: '',
    tips: '',
    route: '',
    city: '',
    photos: [] as File[]
  };

  selectedPhotos: string[] = [];
  showImageModal = false;
  currentImageIndex = 0;

  constructor(private communityService: CommunityHubService) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.loggedInUser = JSON.parse(user);
    }
    this.isloggedIn = !!sessionStorage.getItem('Loggedinuser');
    this.loadPosts();
  }

  loadPosts(): void {
    this.communityService.getAllPosts().subscribe({
      next: (posts) => {
        this.travelPosts = posts.map(post => ({
          ...post,
          createdAt: post.createdAt || (post as any).timestamp
        }));
        this.communityService.updatePosts(this.travelPosts);
      },
      error: (err) => console.error('Error loading posts', err)
    });
  }

  addComment(postId: string): void {
    if (!this.newComment.trim() || !postId) return;
    
    const userData = JSON.parse(sessionStorage.getItem('Loggedinuser') || '{}');
    const comment: Comment = {
      content: this.newComment,
      author: userData.name || 'Anonymous',
      authorPhoto: userData.picture || '',
      createdAt: new Date().toISOString()
    };

    this.communityService.addComment(postId, comment).subscribe({
      next: (updatedPost) => {
        const index = this.travelPosts.findIndex(p => p.id === postId);
        if (index !== -1) {
          this.travelPosts[index] = updatedPost;
        }
        this.newComment = '';
      },
      error: (err) => console.error('Error adding comment', err)
    });
  }

  toggleComments(postId: string): void {
    this.currentPostId = this.currentPostId === postId ? null : postId;
  }

  onFileSelect(event: any): void {
    const files = event.target.files;
    for (let file of files) {
      this.newPost.photos.push(file);
    }
  }

  removePhoto(index: number): void {
    this.newPost.photos.splice(index, 1);
  }

  createPostWithImages(imageFilenames: string[]): void {
    const userData = JSON.parse(sessionStorage.getItem('Loggedinuser') || '{}');
    console.log('User Data:', userData)
    const postData: TravelPost = {
      title: this.newPost.title,
      route: this.newPost.route,
      city: this.newPost.city,
      story: this.newPost.story,
      tips: this.newPost.tips,
      photos: imageFilenames,
      likes: 0,
      posterName: userData.name || 'Anonymous',
      posterPhoto: userData.picture || '',
      createdAt: new Date().toISOString(),
      comments: []
    };

    this.communityService.createPost(postData).subscribe({
      next: (createdPost) => {
        this.travelPosts.unshift(createdPost);
        this.communityService.updatePosts(this.travelPosts);
        this.resetForm();
      },
      error: (err) => console.error('Post creation failed', err)
    });
  }

  submitPost(): void {
    if (this.newPost.photos.length > 0) {
      const fileList = new DataTransfer();
      this.newPost.photos.forEach(file => fileList.items.add(file));

      this.communityService.uploadImages(fileList.files).subscribe({
        next: (res) => {
          this.createPostWithImages(res.imageUrls);
        },
        error: (err) => console.error('Image upload failed', err)
      });
    } else {
      this.createPostWithImages([]);
    }
  }

  resetForm(): void {
    this.newPost = {
      title: '',
      story: '',
      tips: '',
      route: '',
      city: '',
      photos: []
    };
    this.showCreateForm = false;
  }

  formatTimestamp(post: TravelPost): string {
    const dateStr = post.createdAt || (post as any).timestamp;
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'Unknown' : date.toLocaleString();
  }

  likePost(postId?: string): void {
    if (!postId) return;
    this.communityService.likePost(postId).subscribe({
      next: (response) => {
        const post = this.travelPosts.find(p => p.id === postId);
        if (post) {
          post.likes = (post.likes || 0) + 1;
          this.communityService.updatePosts(this.travelPosts);
        }
      },
      error: (err) => console.error('Like failed', err)
    });
  }

  openImageModal(photos: string[], index: number): void {
    this.selectedPhotos = photos;
    this.currentImageIndex = index;
    this.showImageModal = true;
  }

  closeImageModal(): void {
    this.showImageModal = false;
  }

  nextImage(): void {
    if (this.currentImageIndex < this.selectedPhotos.length - 1) {
      this.currentImageIndex++;
    }
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }
}