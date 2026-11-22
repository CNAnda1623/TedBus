import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { url } from '../../config/index';

export type PostTemplate = 'story' | 'itinerary' | 'tip' | 'review';

export interface CommunityComment {
  content: string;
  author: string;
  authorPhoto?: string;
  createdAt: string;
}

export interface CommunityPostItem {
  _id: string;
  title: string;
  template: PostTemplate;
  route?: string;
  city?: string;
  story: string;
  tips?: string;
  photos: string[];
  itineraryDays?: number;
  budgetRange?: string;
  bestSeason?: string;
  tipCategory?: string;
  reviewMode?: 'bus' | 'train' | 'cab';
  operator?: string;
  rating?: number;
  pros?: string;
  cons?: string;
  author: string;
  posterName: string;
  posterPhoto?: string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
  likes: number;
  comments: CommunityComment[];
  isLiked?: boolean;
}

@Component({
  selector: 'app-community-hub',
  standalone: false,
  templateUrl: './community-hub.html',
  styleUrls: ['./community-hub.css']
})
export class CommunityHub implements OnInit {
  posts: CommunityPostItem[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  // Toolbar & Filtering State
  selectedTemplate: string = 'all';
  selectedCity: string = 'All';
  searchQuery: string = '';
  sortOrder: 'newest' | 'likes' = 'newest';

  // Pagination State (9 per page)
  currentPage: number = 1;
  pageSize: number = 9;
  totalPosts: number = 0;
  totalPages: number = 1;

  popularDestinations: string[] = [
    'All', 'Goa', 'Shimla', 'Manali', 'Jaipur', 'Udaipur', 'Kerala', 'Rishikesh', 'Varanasi', 'Ooty'
  ];

  // Create Post Wizard State (Part 3)
  showCreateModal: boolean = false;
  showDiscardConfirm: boolean = false;
  currentStep: number = 1; // 1: Details, 2: Photos, 3: Preview
  createTemplate: PostTemplate = 'story';
  autoSaveStatus: string = 'All changes saved';
  hasUnsavedChanges: boolean = false;
  private autoSaveTimer: any;

  templateOptions = [
    { id: 'story' as PostTemplate, name: 'Trip Story', icon: 'fa-solid fa-book-open', desc: 'Narrative transit experience with tips and road memories' },
    { id: 'itinerary' as PostTemplate, name: 'Itinerary', icon: 'fa-solid fa-calendar-days', desc: 'Structured day-by-day travel plan with budget & season' },
    { id: 'tip' as PostTemplate, name: 'Quick Tip', icon: 'fa-solid fa-lightbulb', desc: 'Bite-sized advice on packing, stops, ticketing or food' },
    { id: 'review' as PostTemplate, name: 'Route Review', icon: 'fa-solid fa-star-half-stroke', desc: 'Detailed transit review with star rating, pros & cons' }
  ];

  seasonOptions = ['Oct - Mar', 'Apr - Jun', 'Jul - Sep', 'All Year Round'];
  tipCategoryOptions = ['Packing & Transit', 'Budget Saving', 'Safety & Comfort', 'Food & Stops'];
  ratingLabels = ['', '1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'];

  routeStops: string[] = ['Delhi', 'Jaipur'];
  destinationTags: string[] = ['Jaipur'];

  itineraryDays: { day: number; title: string; notes: string }[] = [
    { day: 1, title: 'Arrival & Check-in', notes: 'Check in to hotel, evening street food tour and market walk.' },
    { day: 2, title: 'Sightseeing & Transit', notes: 'Full day local attractions, fort tour and sunset viewpoint.' }
  ];

  newPost: any = {
    title: '',
    story: '',
    route: 'Delhi → Jaipur',
    city: 'Jaipur',
    tips: '',
    itineraryDays: 2,
    budgetRange: '₹5,000 - ₹10,000',
    bestSeason: 'Oct - Mar',
    tipCategory: 'Packing & Transit',
    reviewMode: 'bus',
    operator: 'Zingbus Electric',
    rating: 4,
    pros: 'Punctual departure, comfortable seats, USB charging points',
    cons: 'Slightly cold AC at night',
    photos: []
  };

  formError: string = '';
  isSubmitting: boolean = false;
  toastMessage: string = '';

  // Post Detail Modal State
  activeDetailPost: CommunityPostItem | null = null;
  newCommentText: string = '';

  // User state
  loggedInUser: any = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const stored = sessionStorage.getItem('Loggedinuser');
    if (stored) {
      try {
        this.loggedInUser = JSON.parse(stored);
      } catch {}
    }

    this.route.queryParams.subscribe(params => {
      this.currentPage = parseInt(params['page']) || 1;
      if (params['template']) this.selectedTemplate = params['template'];
      if (params['city']) this.selectedCity = params['city'];
      if (params['search']) this.searchQuery = params['search'];
      if (params['sort']) this.sortOrder = params['sort'];
      this.loadPosts();
    });

    this.loadDraft();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    let apiUrl = `${url}api/community/posts?page=${this.currentPage}&pageSize=${this.pageSize}`;
    if (this.selectedTemplate !== 'all') apiUrl += `&template=${this.selectedTemplate}`;
    if (this.selectedCity !== 'All') apiUrl += `&city=${encodeURIComponent(this.selectedCity)}`;
    if (this.searchQuery) apiUrl += `&search=${encodeURIComponent(this.searchQuery)}`;
    if (this.sortOrder === 'likes') apiUrl += `&sort=likes`;

    this.http.get<any>(apiUrl).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.posts) {
          this.posts = res.posts;
          this.totalPosts = res.total;
          this.totalPages = res.totalPages || Math.ceil(res.total / this.pageSize);
        } else if (Array.isArray(res)) {
          this.posts = res;
          this.totalPosts = res.length;
          this.totalPages = Math.ceil(res.length / this.pageSize);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Could not load community posts. Please try again.';
        console.error('Community load error:', err);
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.syncUrlParams();
  }

  setCity(city: string): void {
    this.selectedCity = city;
    this.onFilterChange();
  }

  setTemplateTab(tab: string): void {
    this.selectedTemplate = tab;
    this.onFilterChange();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.syncUrlParams();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  get pagesArray(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  private syncUrlParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage > 1 ? this.currentPage : null,
        template: this.selectedTemplate !== 'all' ? this.selectedTemplate : null,
        city: this.selectedCity !== 'All' ? this.selectedCity : null,
        search: this.searchQuery || null,
        sort: this.sortOrder !== 'newest' ? this.sortOrder : null
      },
      queryParamsHandling: 'merge'
    });
  }

  // Like a post
  handleLike(post: CommunityPostItem, event: Event): void {
    event.stopPropagation();
    if (post.isLiked) return;

    post.likes = (post.likes || 0) + 1;
    post.isLiked = true;

    this.http.patch(`${url}api/community/posts/${post._id}/like`, {}).subscribe({
      next: () => {},
      error: () => {
        post.likes--;
        post.isLiked = false;
      }
    });
  }

  // Relative Time helper (e.g. "2 days ago")
  getRelativeTime(timestamp?: string): string {
    if (!timestamp) return 'Recently';
    const diff = (Date.now() - new Date(timestamp).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  }

  // Generated gradient for posts with no images
  getGradientForDestination(destination: string = ''): string {
    const palettes = [
      'linear-gradient(135deg, #FF6B78 0%, #D63547 100%)',
      'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
      'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
      'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
    ];
    let sum = 0;
    for (let i = 0; i < destination.length; i++) sum += destination.charCodeAt(i);
    return palettes[sum % palettes.length];
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
    if (event.target.parentElement) {
      event.target.parentElement.classList.add('has-fallback-gradient');
    }
  }

  // Open Detail Modal
  openPostDetail(post: CommunityPostItem): void {
    this.activeDetailPost = post;
  }

  closePostDetail(): void {
    this.activeDetailPost = null;
    this.newCommentText = '';
  }

  submitComment(): void {
    if (!this.newCommentText.trim() || !this.activeDetailPost) return;

    const commentData = {
      content: this.newCommentText.trim(),
      author: this.loggedInUser?.name || 'Traveller',
      authorPhoto: this.loggedInUser?.picture || ''
    };

    this.http.post<any>(`${url}api/community/posts/${this.activeDetailPost._id}/comments`, commentData).subscribe({
      next: (updatedPost) => {
        if (updatedPost && updatedPost.comments) {
          this.activeDetailPost!.comments = updatedPost.comments;
        } else {
          this.activeDetailPost!.comments.push({
            content: commentData.content,
            author: commentData.author,
            authorPhoto: commentData.authorPhoto,
            createdAt: new Date().toISOString()
          });
        }
        this.newCommentText = '';
      },
      error: (err) => {
        console.error('Comment error:', err);
      }
    });
  }

  // Create Post Methods (Part 3)
  openCreateModal(): void {
    this.showCreateModal = true;
    this.currentStep = 1;
    this.formError = '';
    this.hasUnsavedChanges = false;
    this.loadDraft();
    document.body.style.overflow = 'hidden';

    // Autosave draft every 5 seconds
    this.autoSaveTimer = setInterval(() => {
      if (this.hasUnsavedChanges) {
        this.saveDraft();
      }
    }, 5000);
  }

  closeCreateModal(): void {
    if (this.hasUnsavedChanges) {
      this.showDiscardConfirm = true;
    } else {
      this.forceCloseModal();
    }
  }

  confirmDiscard(): void {
    this.showDiscardConfirm = false;
    localStorage.removeItem('tedbus_community_draft');
    this.resetForm();
    this.forceCloseModal();
  }

  keepEditing(): void {
    this.showDiscardConfirm = false;
  }

  forceCloseModal(): void {
    this.showCreateModal = false;
    this.showDiscardConfirm = false;
    this.formError = '';
    this.hasUnsavedChanges = false;
    document.body.style.overflow = '';
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  onFieldChange(): void {
    this.hasUnsavedChanges = true;
    this.autoSaveStatus = 'Unsaved changes...';
  }

  switchCreateTemplate(tmpl: PostTemplate): void {
    this.createTemplate = tmpl;
    this.onFieldChange();
  }

  onRouteStopsChange(stops: string[]): void {
    this.routeStops = stops;
    this.newPost.route = stops.filter(s => s && s.trim().length > 0).join(' → ');
    this.onFieldChange();
  }

  onDestinationTagsChange(tags: string[]): void {
    this.destinationTags = tags;
    this.newPost.city = tags.join(', ');
    this.onFieldChange();
  }

  onPhotosChange(photos: string[]): void {
    this.newPost.photos = photos;
    this.onFieldChange();
  }

  addItineraryDay(): void {
    const nextDayNum = this.itineraryDays.length + 1;
    this.itineraryDays.push({
      day: nextDayNum,
      title: `Day ${nextDayNum} Exploration`,
      notes: ''
    });
    this.newPost.itineraryDays = this.itineraryDays.length;
    this.onFieldChange();
  }

  removeItineraryDay(index: number): void {
    if (this.itineraryDays.length <= 1) return;
    this.itineraryDays.splice(index, 1);
    this.itineraryDays.forEach((d, i) => d.day = i + 1);
    this.newPost.itineraryDays = this.itineraryDays.length;
    this.onFieldChange();
  }

  isStep1Valid(): boolean {
    if (!this.newPost.title || this.newPost.title.trim().length < 8) return false;
    if (this.createTemplate === 'tip') {
      return (this.newPost.story && this.newPost.story.trim().length >= 20) && this.destinationTags.length > 0;
    }
    const minStory = 50;
    if (!this.newPost.story || this.newPost.story.trim().length < minStory) return false;
    if (!this.destinationTags || this.destinationTags.length === 0) return false;
    return true;
  }

  getMissingFieldsHint(): string {
    const missing: string[] = [];
    if (!this.newPost.title || this.newPost.title.trim().length < 8) {
      missing.push('Title (min 8 chars)');
    }
    const minLen = this.createTemplate === 'tip' ? 20 : 50;
    if (!this.newPost.story || this.newPost.story.trim().length < minLen) {
      missing.push(`Body (min ${minLen} chars)`);
    }
    if (!this.destinationTags || this.destinationTags.length === 0) {
      missing.push('Destination tag');
    }
    return missing.length > 0 ? `Required: ${missing.join(', ')}` : 'Ready to proceed';
  }

  nextStep(): void {
    this.formError = '';
    if (this.currentStep === 1) {
      if (!this.isStep1Valid()) {
        this.formError = this.getMissingFieldsHint();
        return;
      }
      this.currentStep = 2; // Photos
    } else if (this.currentStep === 2) {
      this.currentStep = 3; // Preview
    }
  }

  prevStep(): void {
    this.formError = '';
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  incrementDays(): void {
    if (this.newPost.itineraryDays < 30) {
      this.newPost.itineraryDays++;
      this.onFieldChange();
    }
  }

  decrementDays(): void {
    if (this.newPost.itineraryDays > 1) {
      this.newPost.itineraryDays--;
      this.onFieldChange();
    }
  }

  saveDraft(): void {
    try {
      const draftData = {
        newPost: this.newPost,
        createTemplate: this.createTemplate,
        routeStops: this.routeStops,
        destinationTags: this.destinationTags,
        itineraryDays: this.itineraryDays
      };
      localStorage.setItem('tedbus_community_draft', JSON.stringify(draftData));
      this.autoSaveStatus = 'Saved just now';
    } catch {}
  }

  loadDraft(): void {
    try {
      const draft = localStorage.getItem('tedbus_community_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.newPost) this.newPost = Object.assign(this.newPost, parsed.newPost);
        if (parsed.createTemplate) this.createTemplate = parsed.createTemplate;
        if (parsed.routeStops) this.routeStops = parsed.routeStops;
        if (parsed.destinationTags) this.destinationTags = parsed.destinationTags;
        if (parsed.itineraryDays) this.itineraryDays = parsed.itineraryDays;
      }
    } catch {}
  }

  submitNewPost(): void {
    this.formError = '';

    if (!this.isStep1Valid()) {
      this.formError = this.getMissingFieldsHint();
      this.currentStep = 1;
      return;
    }

    this.isSubmitting = true;

    // Build story with itinerary day cards if template is itinerary
    let finalStory = this.newPost.story;
    if (this.createTemplate === 'itinerary' && this.itineraryDays.length > 0) {
      const dayNotes = this.itineraryDays.map(d => `Day ${d.day}: ${d.title}\n${d.notes}`).join('\n\n');
      finalStory = `${this.newPost.story}\n\n--- ITINERARY ---\n${dayNotes}`;
    }

    const payload = {
      ...this.newPost,
      story: finalStory,
      route: this.routeStops.join(' → '),
      city: this.destinationTags.join(', '),
      template: this.createTemplate,
      posterName: this.loggedInUser?.name || 'Traveller',
      posterPhoto: this.loggedInUser?.picture || ''
    };

    this.http.post<any>(`${url}api/community/posts`, payload).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.posts.unshift(created);
        this.forceCloseModal();
        this.toastMessage = '🎉 Story published successfully to Community Hub!';
        setTimeout(() => this.toastMessage = '', 4000);
        localStorage.removeItem('tedbus_community_draft');
        this.resetForm();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.formError = err?.error?.message || 'Failed to publish post. Please check connection and retry.';
      }
    });
  }

  resetForm(): void {
    this.routeStops = ['Delhi', 'Jaipur'];
    this.destinationTags = ['Jaipur'];
    this.itineraryDays = [
      { day: 1, title: 'Arrival & Check-in', notes: 'Check in to hotel, evening street food tour and market walk.' },
      { day: 2, title: 'Sightseeing & Transit', notes: 'Full day local attractions, fort tour and sunset viewpoint.' }
    ];
    this.newPost = {
      title: '',
      story: '',
      route: 'Delhi → Jaipur',
      city: 'Jaipur',
      tips: '',
      itineraryDays: 2,
      budgetRange: '₹5,000 - ₹10,000',
      bestSeason: 'Oct - Mar',
      tipCategory: 'Packing & Transit',
      reviewMode: 'bus',
      operator: 'Zingbus Electric',
      rating: 4,
      pros: 'Punctual departure, comfortable seats, USB charging points',
      cons: 'Slightly cold AC at night',
      photos: []
    };
  }

  sharePost(post: CommunityPostItem, event: Event): void {
    event.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `Check out this travel story on Tedbus: ${post.title}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      this.toastMessage = 'Link copied to clipboard!';
      setTimeout(() => this.toastMessage = '', 3000);
    }
  }
}
