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
    this.communityService.getAllPosts().subscribe({
      next: (posts) => {
        this.travelPosts = posts;
        this.communityService.updatePosts(posts); // update local state
      },
      error: (err) => console.error('Error loading posts', err)
    });
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


  createPostWithImages(imageFilenames: string[]) {
    const postData: TravelPost = {
      title: this.newPost.title,
      route: this.newPost.route,
      city: this.newPost.city,
      story: this.newPost.story,
      tips: this.newPost.tips,
      photos: imageFilenames,
      likes: 0,
      posterName: 'Anonymous', // Or replace with logged-in user name
      createdAt: new Date().toISOString(),
      comments: []
    };
    console.log('Creating post with data:', postData);

    this.communityService.createPost(postData).subscribe({
      next: (createdPost) => {
        console.log('Post created successfully', createdPost);
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
          console.log('Images uploaded successfully', res);
          this.createPostWithImages(res.imageFilenames);
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

  formatTimestamp(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN');
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
