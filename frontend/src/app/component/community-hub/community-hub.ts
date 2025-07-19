import { Component, OnInit } from '@angular/core';

export interface TravelPost {
  id: string;
  title: string;
  story: string;
  tips: string;
  photos: string[];
  posterName: string;
  route: string;
  city: string;
  timestamp: Date;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-community-hub',
  templateUrl: './community-hub.html',
  styleUrls: ['./community-hub.css'],
  standalone: false,
})
export class CommunityHub implements OnInit {
  
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
  travelPosts: TravelPost[] = [
    {
      id: '1',
      title: 'Amazing Journey to Kerala Backwaters',
      story: 'Just returned from an incredible 5-day trip to Kerala! The backwaters of Alleppey were absolutely mesmerizing. Staying in a traditional houseboat was an experience of a lifetime. The peaceful waters, lush greenery, and warm hospitality made this trip unforgettable.',
      tips: '• Book houseboat in advance during peak season\n• Try the local fish curry - it\'s amazing!\n• Carry mosquito repellent\n• Best time to visit is October to March',
      photos: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400'
      ],
      posterName: 'Arjun Sharma',
      route: 'Delhi to Kochi',
      city: 'Alleppey',
      timestamp: new Date('2024-07-15'),
      likes: 24,
      comments: []
    },
    {
      id: '2',
      title: 'Rajasthan Royal Experience',
      story: 'Explored the royal heritage of Rajasthan over 7 days. From the majestic forts of Jaipur to the romantic lakes of Udaipur, every moment was magical. The architecture, culture, and food left me spellbound.',
      tips: '• Visit Amber Fort early morning to avoid crowds\n• Stay in heritage hotels for authentic experience\n• Don\'t miss the sunset at Lake Pichola\n• Try Dal Baati Churma - local specialty',
      photos: [
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400',
        'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400'
      ],
      posterName: 'Priya Mehta',
      route: 'Mumbai to Jaipur',
      city: 'Jaipur, Udaipur',
      timestamp: new Date('2024-07-10'),
      likes: 18,
      comments: []
    },
    {
      id: '3',
      title: 'Himalayan Adventure in Manali',
      story: 'An adventurous week in the mountains! Trekking through the beautiful valleys, river rafting in Beas, and camping under the stars. The crisp mountain air and breathtaking views were rejuvenating.',
      tips: '• Pack warm clothes even in summer\n• Book adventure activities in advance\n• Try local Himachali cuisine\n• Carry altitude sickness medication\n• Best for photography enthusiasts',
      photos: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        'https://images.unsplash.com/photo-1464822759844-d150baec95b5?w=400',
        'https://images.unsplash.com/photo-1471931797661-c4e9814e3470?w=400'
      ],
      posterName: 'Vikram Singh',
      route: 'Delhi to Manali',
      city: 'Manali',
      timestamp: new Date('2024-07-08'),
      likes: 31,
      comments: []
    }
  ];

  selectedPhotos: string[] = [];
  showImageModal = false;
  currentImageIndex = 0;

  constructor() { }

  ngOnInit(): void {
    // Initialize component
  }

  onFileSelect(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.newPost.photos = Array.from(files);
    }
  }

  removePhoto(index: number): void {
    this.newPost.photos.splice(index, 1);
  }

  submitPost(): void {
    if (this.newPost.title && this.newPost.story) {
      // Convert files to URLs for display (in real app, upload to server)
      const photoUrls: string[] = [];
      
      const newTravelPost: TravelPost = {
        id: Date.now().toString(),
        title: this.newPost.title,
        story: this.newPost.story,
        tips: this.newPost.tips,
        photos: photoUrls, // In real app, these would be uploaded image URLs
        posterName: 'Current User', // In real app, get from auth service
        route: this.newPost.route,
        city: this.newPost.city,
        timestamp: new Date(),
        likes: 0,
        comments: []
      };

      this.travelPosts.unshift(newTravelPost);
      this.resetForm();
      
      // Show success message
      alert('Post shared successfully!');
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
  }

  likePost(postId: string): void {
    const post = this.travelPosts.find(p => p.id === postId);
    if (post) {
      post.likes++;
    }
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

  formatTimestamp(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    }
  }
}