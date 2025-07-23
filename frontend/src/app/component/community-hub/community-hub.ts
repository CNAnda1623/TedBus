import { Component, OnInit } from '@angular/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommunityHubService } from '../../service/community-hub.service';
import { TravelPost, Comment } from './../../model/community-post.model';

// export interface TravelPost {
//   id: string;
//   title: string;
//   story: string;
//   tips: string;
//   photos: string[];
//   posterName: string;
//   route: string;
//   city: string;
//   timestamp: Date;
//   likes: number;
//   comments: Comment[];
// }

// export interface Comment {
//   id: string;
//   author: string;
//   content: string;
//   timestamp: Date;
// }

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

  // Mock data for demonstration
  
  selectedPhotos: string[] = [];
  showImageModal = false;
  currentImageIndex = 0;

  constructor(private communityService: CommunityHubService) { }

  ngOnInit(): void {
    // Initialize component
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

  submitPost(): void {
    // this.showCreateForm = false;
    if (this.newPost.photos.length > 0) {
      const fileList = new DataTransfer();
      this.newPost.photos.forEach(file => fileList.items.add(file));

      this.communityService.uploadImages(fileList.files).subscribe({
        next: (imageUrls) => {
          this.createPostWithImages(imageUrls);
        },
        error: (err) => console.error('Image upload failed', err)
      });
    } else {
      this.createPostWithImages([]);
    }
  }

  createPostWithImages(imageUrls: string[]) {
    const postData: TravelPost = {
      title: this.newPost.title,
      route: this.newPost.route,
      city: this.newPost.city,
      story: this.newPost.story,
      tips: this.newPost.tips,
      photos: imageUrls,
      likes: 0,
      author: 'Anonymous', // Replace with logged-in user
      timestamp: new Date().toISOString(),
      comments: []
    };

    this.communityService.createPost(postData).subscribe({
      next: (createdPost) => {
        this.travelPosts.unshift(createdPost); // Add new post on top
        this.communityService.updatePosts(this.travelPosts);
        this.resetForm();
      },
      error: (err) => console.error('Post creation failed', err)
    });
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
    // const fileInput = document.querySelector('.photo-input') as HTMLInputElement;
    //   if (fileInput) {
    //     fileInput.value = '';
    //   }
    this.showCreateForm = false;
  }

  formatTimestamp(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN');
  }
  
  likePost(postId?: string) {
    if(!postId) return;
    this.communityService.likePost(postId).subscribe({
      next: () => {
        const post = this.travelPosts.find(p => p.id === postId);
        if (post) post.likes += 1;
        this.communityService.updatePosts(this.travelPosts);
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