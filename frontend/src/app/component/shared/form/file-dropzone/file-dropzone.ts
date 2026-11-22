import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-dropzone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-dropzone.html',
  styleUrls: ['./file-dropzone.css']
})
export class FileDropzone implements OnInit {
  @Input() photos: string[] = [];
  @Input() maxPhotos: number = 5;
  @Input() maxSizeBytes: number = 5 * 1024 * 1024; // 5 MB

  @Output() photosChange = new EventEmitter<string[]>();

  isDragOver: boolean = false;
  uploadProgress: number = 0;
  isUploading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    if (!this.photos) this.photos = [];
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    if (event.dataTransfer && event.dataTransfer.files) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  onFileInput(event: any): void {
    if (event.target && event.target.files) {
      this.handleFiles(Array.from(event.target.files));
    }
  }

  handleFiles(files: File[]): void {
    this.errorMessage = '';
    const validImageFiles = files.filter(f => f.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      this.errorMessage = 'Please select valid image files (JPG or PNG).';
      return;
    }

    if (this.photos.length + validImageFiles.length > this.maxPhotos) {
      this.errorMessage = `You can upload up to ${this.maxPhotos} photos in total.`;
      return;
    }

    for (const file of validImageFiles) {
      if (file.size > this.maxSizeBytes) {
        this.errorMessage = `"${file.name}" exceeds the 5 MB limit.`;
        return;
      }
    }

    // Process files with progress simulation
    this.isUploading = true;
    this.uploadProgress = 20;

    const readPromises = validImageFiles.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: any) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    setTimeout(() => {
      this.uploadProgress = 70;
      Promise.all(readPromises).then(base64Array => {
        this.photos.push(...base64Array);
        this.photosChange.emit([...this.photos]);
        this.uploadProgress = 100;
        setTimeout(() => {
          this.isUploading = false;
          this.uploadProgress = 0;
        }, 300);
      }).catch(err => {
        console.error('File read error:', err);
        this.errorMessage = 'Failed to read image files.';
        this.isUploading = false;
      });
    }, 400);
  }

  removePhoto(index: number): void {
    this.photos.splice(index, 1);
    this.photosChange.emit([...this.photos]);
  }

  setCover(index: number): void {
    if (index === 0) return;
    const item = this.photos.splice(index, 1)[0];
    this.photos.unshift(item);
    this.photosChange.emit([...this.photos]);
  }
}
