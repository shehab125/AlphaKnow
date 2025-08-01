// Media Management Module
class MediaManager {
  constructor() {
    this.media = [];
    this.loadFromStorage();
  }

  // CRUD operations
  async uploadMedia(file) {
    try {
      const mediaItem = {
        id: this.generateId(),
        name: file.name,
        type: file.type,
        size: this.formatFileSize(file.size),
        url: await this.processFile(file),
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'admin',
        alt: '',
        description: ''
      };

      this.media.push(mediaItem);
      this.saveToStorage();
      
      return mediaItem;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  async updateMedia(id, updates) {
    try {
      const index = this.media.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error('Media not found');
      }

      this.media[index] = {
        ...this.media[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      this.saveToStorage();
      return this.media[index];
    } catch (error) {
      console.error('Error updating media:', error);
      throw error;
    }
  }

  async deleteMedia(id) {
    try {
      const index = this.media.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error('Media not found');
      }

      this.media.splice(index, 1);
      this.saveToStorage();
      
      return true;
    } catch (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  }

  async getMedia(id) {
    const mediaItem = this.media.find(item => item.id === id);
    if (!mediaItem) {
      throw new Error('Media not found');
    }
    return mediaItem;
  }

  async getAllMedia(filters = {}) {
    let filteredMedia = [...this.media];

    // Apply filters
    if (filters.type) {
      filteredMedia = filteredMedia.filter(item => item.type.startsWith(filters.type));
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredMedia = filteredMedia.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredMedia.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date':
            return new Date(b.uploadedAt) - new Date(a.uploadedAt);
          case 'name':
            return a.name.localeCompare(b.name, 'ar');
          case 'size':
            return this.parseFileSize(b.size) - this.parseFileSize(a.size);
          default:
            return 0;
        }
      });
    }

    return filteredMedia;
  }

  // File processing
  async processFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  parseFileSize(sizeString) {
    const match = sizeString.match(/^([\d.]+)\s*([KMGT]?B)$/i);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    
    const multipliers = { 'B': 1, 'KB': 1024, 'MB': 1024*1024, 'GB': 1024*1024*1024 };
    return value * (multipliers[unit] || 1);
  }

  // Storage operations
  saveToStorage() {
    localStorage.setItem('alphaknow_media', JSON.stringify(this.media));
  }

  loadFromStorage() {
    const stored = localStorage.getItem('alphaknow_media');
    this.media = stored ? JSON.parse(stored) : this.getDefaultMedia();
  }

  getDefaultMedia() {
    return [
      {
        id: '1',
        name: 'hero-image.jpg',
        type: 'image/jpeg',
        size: '2.5 MB',
        url: '../images/hero-image.jpg',
        uploadedAt: '2024-01-15T00:00:00.000Z',
        uploadedBy: 'admin',
        alt: 'صورة رئيسية للموقع',
        description: 'صورة رئيسية تعرض مفهوم ريادة الأعمال الرقمية'
      },
      {
        id: '2',
        name: 'logo.png',
        type: 'image/png',
        size: '150 KB',
        url: '../images/logo.png',
        uploadedAt: '2024-01-10T00:00:00.000Z',
        uploadedBy: 'admin',
        alt: 'شعار AlphaKnow',
        description: 'شعار الموقع الرسمي'
      }
    ];
  }

  // Utility methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  validateMedia(mediaData) {
    const errors = [];

    if (!mediaData.name) {
      errors.push('اسم الملف مطلوب');
    }

    if (!mediaData.url) {
      errors.push('رابط الملف مطلوب');
    }

    return errors;
  }

  // Get media by type
  getMediaByType(type) {
    return this.media.filter(item => item.type.startsWith(type));
  }

  // Get images
  getImages() {
    return this.getMediaByType('image');
  }

  // Get videos
  getVideos() {
    return this.getMediaByType('video');
  }

  // Get documents
  getDocuments() {
    return this.media.filter(item => 
      item.type.includes('pdf') || 
      item.type.includes('doc') || 
      item.type.includes('txt')
    );
  }

  // Search media
  searchMedia(query) {
    const searchTerm = query.toLowerCase();
    return this.media.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.alt.toLowerCase().includes(searchTerm)
    );
  }

  // Bulk operations
  async bulkDelete(mediaIds) {
    try {
      const deletedMedia = [];
      
      for (const id of mediaIds) {
        await this.deleteMedia(id);
        deletedMedia.push(id);
      }
      
      return deletedMedia;
    } catch (error) {
      console.error('Error in bulk delete:', error);
      throw error;
    }
  }

  // Export/Import functionality
  exportMedia() {
    const dataStr = JSON.stringify(this.media, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `media-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  async importMedia(file) {
    try {
      const text = await file.text();
      const importedMedia = JSON.parse(text);
      
      // Validate imported data
      if (!Array.isArray(importedMedia)) {
        throw new Error('Invalid file format');
      }

      // Merge with existing media
      this.media = [...this.media, ...importedMedia];
      this.saveToStorage();
      
      return importedMedia.length;
    } catch (error) {
      console.error('Error importing media:', error);
      throw error;
    }
  }

  // Get media statistics
  getMediaStats() {
    const totalMedia = this.media.length;
    const totalSize = this.media.reduce((sum, item) => sum + this.parseFileSize(item.size), 0);
    const images = this.getImages().length;
    const videos = this.getVideos().length;
    const documents = this.getDocuments().length;

    return {
      totalMedia,
      totalSize: this.formatFileSize(totalSize),
      images,
      videos,
      documents
    };
  }

  // Get recent uploads
  getRecentUploads(limit = 10) {
    return this.media
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .slice(0, limit);
  }

  // Get largest files
  getLargestFiles(limit = 10) {
    return this.media
      .sort((a, b) => this.parseFileSize(b.size) - this.parseFileSize(a.size))
      .slice(0, limit);
  }

  // Duplicate media
  async duplicateMedia(id) {
    try {
      const originalMedia = await this.getMedia(id);
      const duplicatedMedia = {
        ...originalMedia,
        id: this.generateId(),
        name: `${originalMedia.name} (نسخة)`,
        uploadedAt: new Date().toISOString()
      };

      delete duplicatedMedia.id;
      return await this.uploadMedia(duplicatedMedia);
    } catch (error) {
      console.error('Error duplicating media:', error);
      throw error;
    }
  }

  // Generate thumbnail for images
  generateThumbnail(imageUrl, width = 150, height = 150) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = imageUrl;
    });
  }

  // Compress image
  async compressImage(file, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
}

// Initialize media manager
const mediaManager = new MediaManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MediaManager;
} else {
  window.MediaManager = MediaManager;
  window.mediaManager = mediaManager;
} 