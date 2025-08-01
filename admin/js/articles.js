// Articles Management Module
class ArticlesManager {
  constructor() {
    this.articles = [];
    this.currentArticle = null;
    this.editor = null;
  }

  // Initialize Quill editor with Arabic support
  initializeEditor() {
    if (typeof Quill !== 'undefined') {
      const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video', 'blockquote', 'code-block'],
        ['clean']
      ];

      this.editor = new Quill('#article-editor', {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions,
          imageHandler: {
            upload: (file) => this.handleImageUpload(file)
          }
        },
        placeholder: 'ابدأ بكتابة محتوى المقال هنا...',
        formats: [
          'header', 'bold', 'italic', 'underline', 'strike',
          'color', 'background', 'font', 'size', 'list', 'bullet',
          'indent', 'align', 'link', 'image', 'video', 'blockquote', 'code-block'
        ]
      });

      // Add custom image handler
      this.setupImageHandler();
    }
  }

  setupImageHandler() {
    const toolbar = this.editor.getModule('toolbar');
    toolbar.addHandler('image', () => {
      this.selectImage();
    });
  }

  selectImage() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        this.handleImageUpload(file);
      }
    };
  }

  async handleImageUpload(file) {
    try {
      // Show loading indicator
      const range = this.editor.getSelection();
      const loadingId = this.editor.insertEmbed(range.index, 'image', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
      
      // Simulate upload (replace with actual upload logic)
      const imageUrl = await this.uploadImage(file);
      
      // Replace loading image with actual image
      this.editor.deleteText(range.index, 1);
      this.editor.insertEmbed(range.index, 'image', imageUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      this.showError('فشل في رفع الصورة');
    }
  }

  async uploadImage(file) {
    // Simulate image upload
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  // Article CRUD operations
  async createArticle(articleData) {
    try {
      const article = {
        id: this.generateId(),
        ...articleData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        comments: []
      };

      this.articles.push(article);
      this.saveToStorage();
      
      return article;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  async updateArticle(id, updates) {
    try {
      const index = this.articles.findIndex(article => article.id === id);
      if (index === -1) {
        throw new Error('Article not found');
      }

      this.articles[index] = {
        ...this.articles[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      this.saveToStorage();
      return this.articles[index];
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  }

  async deleteArticle(id) {
    try {
      const index = this.articles.findIndex(article => article.id === id);
      if (index === -1) {
        throw new Error('Article not found');
      }

      this.articles.splice(index, 1);
      this.saveToStorage();
      
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  }

  async getArticle(id) {
    const article = this.articles.find(article => article.id === id);
    if (!article) {
      throw new Error('Article not found');
    }
    return article;
  }

  async getAllArticles(filters = {}) {
    let filteredArticles = [...this.articles];

    // Apply filters
    if (filters.category) {
      filteredArticles = filteredArticles.filter(article => article.category === filters.category);
    }

    if (filters.status) {
      filteredArticles = filteredArticles.filter(article => article.status === filters.status);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredArticles.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'views':
            return b.views - a.views;
          case 'title':
            return a.title.localeCompare(b.title, 'ar');
          default:
            return 0;
        }
      });
    }

    return filteredArticles;
  }

  // Storage operations
  saveToStorage() {
    localStorage.setItem('alphaknow_articles', JSON.stringify(this.articles));
  }

  loadFromStorage() {
    const stored = localStorage.getItem('alphaknow_articles');
    this.articles = stored ? JSON.parse(stored) : [];
  }

  // Utility methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  validateArticle(articleData) {
    const errors = [];

    if (!articleData.title || articleData.title.trim().length < 3) {
      errors.push('العنوان يجب أن يكون 3 أحرف على الأقل');
    }

    if (!articleData.content || articleData.content.trim().length < 50) {
      errors.push('المحتوى يجب أن يكون 50 حرف على الأقل');
    }

    if (!articleData.category) {
      errors.push('يجب اختيار فئة للمقال');
    }

    return errors;
  }

  // SEO optimization
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  generateMetaDescription(content, maxLength = 160) {
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  }

  // Export/Import functionality
  exportArticles() {
    const dataStr = JSON.stringify(this.articles, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `articles-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  async importArticles(file) {
    try {
      const text = await file.text();
      const importedArticles = JSON.parse(text);
      
      // Validate imported data
      if (!Array.isArray(importedArticles)) {
        throw new Error('Invalid file format');
      }

      // Merge with existing articles
      this.articles = [...this.articles, ...importedArticles];
      this.saveToStorage();
      
      return importedArticles.length;
    } catch (error) {
      console.error('Error importing articles:', error);
      throw error;
    }
  }

  // Analytics
  incrementViews(articleId) {
    const article = this.articles.find(a => a.id === articleId);
    if (article) {
      article.views++;
      this.saveToStorage();
    }
  }

  getPopularArticles(limit = 10) {
    return this.articles
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  getRecentArticles(limit = 10) {
    return this.articles
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  // Bulk operations
  async bulkUpdate(articleIds, updates) {
    try {
      const updatedArticles = [];
      
      for (const id of articleIds) {
        const article = await this.updateArticle(id, updates);
        updatedArticles.push(article);
      }
      
      return updatedArticles;
    } catch (error) {
      console.error('Error in bulk update:', error);
      throw error;
    }
  }

  async bulkDelete(articleIds) {
    try {
      const deletedArticles = [];
      
      for (const id of articleIds) {
        await this.deleteArticle(id);
        deletedArticles.push(id);
      }
      
      return deletedArticles;
    } catch (error) {
      console.error('Error in bulk delete:', error);
      throw error;
    }
  }

  // Search functionality
  searchArticles(query, options = {}) {
    const {
      searchIn = ['title', 'excerpt', 'content'],
      caseSensitive = false,
      fuzzy = false
    } = options;

    const searchTerm = caseSensitive ? query : query.toLowerCase();
    
    return this.articles.filter(article => {
      return searchIn.some(field => {
        const content = article[field] || '';
        const searchContent = caseSensitive ? content : content.toLowerCase();
        
        if (fuzzy) {
          // Simple fuzzy search
          return searchTerm.split('').every(char => searchContent.includes(char));
        } else {
          return searchContent.includes(searchTerm);
        }
      });
    });
  }

  // Auto-save functionality
  setupAutoSave(articleId, interval = 30000) {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    this.autoSaveInterval = setInterval(() => {
      if (this.editor && articleId) {
        const content = this.editor.root.innerHTML;
        this.updateArticle(articleId, { content });
        console.log('Auto-saved article');
      }
    }, interval);
  }

  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  // Preview functionality
  generatePreview(articleData) {
    const preview = {
      ...articleData,
      id: 'preview',
      createdAt: new Date().toISOString(),
      views: 0
    };

    return preview;
  }

  // Duplicate article
  async duplicateArticle(articleId) {
    try {
      const originalArticle = await this.getArticle(articleId);
      const duplicatedArticle = {
        ...originalArticle,
        id: this.generateId(),
        title: `${originalArticle.title} (نسخة)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        comments: []
      };

      delete duplicatedArticle.id;
      return await this.createArticle(duplicatedArticle);
    } catch (error) {
      console.error('Error duplicating article:', error);
      throw error;
    }
  }

  // Version control (simple)
  saveVersion(articleId, versionData) {
    const article = this.articles.find(a => a.id === articleId);
    if (article) {
      if (!article.versions) {
        article.versions = [];
      }
      
      article.versions.push({
        id: this.generateId(),
        ...versionData,
        createdAt: new Date().toISOString()
      });

      // Keep only last 10 versions
      if (article.versions.length > 10) {
        article.versions = article.versions.slice(-10);
      }

      this.saveToStorage();
    }
  }

  getVersions(articleId) {
    const article = this.articles.find(a => a.id === articleId);
    return article?.versions || [];
  }

  restoreVersion(articleId, versionId) {
    const article = this.articles.find(a => a.id === articleId);
    if (article && article.versions) {
      const version = article.versions.find(v => v.id === versionId);
      if (version) {
        // Save current state as new version
        this.saveVersion(articleId, {
          title: article.title,
          content: article.content,
          excerpt: article.excerpt
        });

        // Restore version
        Object.assign(article, version);
        this.saveToStorage();
        
        return article;
      }
    }
    throw new Error('Version not found');
  }
}

// Initialize articles manager
const articlesManager = new ArticlesManager();
articlesManager.loadFromStorage();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ArticlesManager;
} else {
  window.ArticlesManager = ArticlesManager;
  window.articlesManager = articlesManager;
} 