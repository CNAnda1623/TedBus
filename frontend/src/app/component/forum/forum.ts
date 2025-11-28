import { Component , OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface User {
  id: string;
  name: string;
  photoUrl: string;
}

export interface Comment {
  id: string;
  text: string;
  author: User;
  timestamp: Date;
}

export interface ForumThread {
  id: string;
  title: string;
  description: string;
  author: User;
  timestamp: Date;
  comments: Comment[];
  expanded?: boolean;
}

@Component({
  selector: 'app-forum',
  standalone: false,
  templateUrl: './forum.html',
  styleUrl: './forum.css'
})

export class Forum implements OnInit {
  forumForm: FormGroup;
  commentForms: { [key: string]: FormGroup } = {};
  
  // Mock current user (in real app, get from auth service)
  currentUser: User = {
    id: '1',
    name: 'John Traveler',
    photoUrl: 'https://via.placeholder.com/40x40/ff9999/fff?text=JT'
  };

  isLoggedIn = true; // Mock auth state

  threads: ForumThread[] = [
    {
      id: '1',
      title: 'Best Routes for Ladakh Bike Trip?',
      description: 'Planning a motorcycle trip to Ladakh next month. Looking for recommendations on the best routes, fuel stops, and places to stay. Any experienced riders here?',
      author: {
        id: '2',
        name: 'Adventure Seeker',
        photoUrl: 'https://via.placeholder.com/40x40/ff9999/fff?text=AS'
      },
      timestamp: new Date('2025-07-25T10:30:00'),
      comments: [
        {
          id: '1',
          text: 'I did this trip last year! Manali-Leh highway is amazing but challenging. Make sure to acclimatize properly.',
          author: {
            id: '3',
            name: 'Mountain Explorer',
            photoUrl: 'https://via.placeholder.com/40x40/ff9999/fff?text=ME'
          },
          timestamp: new Date('2025-07-25T11:15:00')
        }
      ],
      expanded: false
    },
    {
      id: '2',
      title: 'Hidden Gems in Kerala Backwaters',
      description: 'Just returned from Kerala and discovered some amazing off-the-beaten-path locations in the backwaters. Happy to share details and photos!',
      author: {
        id: '4',
        name: 'Backwater Belle',
        photoUrl: 'https://via.placeholder.com/40x40/ff9999/fff?text=BB'
      },
      timestamp: new Date('2025-07-24T16:45:00'),
      comments: [],
      expanded: false
    }
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.forumForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    // Initialize comment forms for each thread
    this.threads.forEach(thread => {
      this.commentForms[thread.id] = this.fb.group({
        text: ['', [Validators.required, Validators.minLength(5)]]
      });
    });
  }

  onSubmitForum(): void {
    if (this.forumForm.valid && this.isLoggedIn) {
      const newThread: ForumThread = {
        id: (this.threads.length + 1).toString(),
        title: this.forumForm.get('title')?.value,
        description: this.forumForm.get('description')?.value,
        author: this.currentUser,
        timestamp: new Date(),
        comments: [],
        expanded: false
      };

      this.threads.unshift(newThread);
      this.commentForms[newThread.id] = this.fb.group({
        text: ['', [Validators.required, Validators.minLength(5)]]
      });

      this.forumForm.reset();
      this.showSnackBar('Discussion posted successfully!');
      
      // Auto-scroll to new thread
      setTimeout(() => {
        document.querySelector('.thread-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  onClearForm(): void {
    this.forumForm.reset();
  }

  toggleThread(threadId: string): void {
    const thread = this.threads.find(t => t.id === threadId);
    if (thread) {
      thread.expanded = !thread.expanded;
    }
  }

  onSubmitComment(threadId: string): void {
    const commentForm = this.commentForms[threadId];
    if (commentForm.valid && this.isLoggedIn) {
      const thread = this.threads.find(t => t.id === threadId);
      if (thread) {
        const newComment: Comment = {
          id: (thread.comments.length + 1).toString(),
          text: commentForm.get('text')?.value,
          author: this.currentUser,
          timestamp: new Date()
        };

        thread.comments.push(newComment);
        commentForm.reset();
        this.showSnackBar('Comment added successfully!');
        
        // Auto-scroll to new comment
        setTimeout(() => {
          const commentSection = document.querySelector(`#thread-${threadId} .comments-section`);
          commentSection?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
      }
    }
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  getTruncatedDescription(description: string, maxLength: number = 150): string {
    return description.length > maxLength 
      ? description.substring(0, maxLength) + '...' 
      : description;
  }

  trackByThreadId(index: number, thread: ForumThread): string {
    return thread.id;
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
