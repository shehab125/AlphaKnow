// Admin Panel Main JavaScript
class AdminPanel {
  constructor() {
    this.currentSection = 'dashboard';
    this.articles = [];
    this.categories = [];
    this.users = [];
    this.media = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.searchQuery = '';
    this.filters = {};
    
    this.init();
  }

  async init() {
    try {
      // Check authentication first
      await this.checkAuthentication();
      
      // Initialize components
      this.initializeNavigation();
      this.initializeEventListeners();
      this.initializeQuillEditor();
      this.initializeSelect2();
      
      // Load initial data
      await this.loadDashboardData();
      await this.loadArticles();
      await this.loadCategories();
      await this.loadUsers();
      await this.loadMedia();
      
      // Initialize analytics
      this.initializeAnalytics();
      
      console.log('✅ Admin Panel initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing admin panel:', error);
      this.showError('حدث خطأ أثناء تحميل لوحة التحكم');
    }
  }

  async checkAuthentication() {
    return new Promise((resolve, reject) => {
      firebaseService.onAuthStateChanged((user) => {
        if (user) {
          // User is authenticated
          this.updateUserInfo(user);
          resolve();
        } else {
          // User is not authenticated, redirect to login
          window.location.href = 'login.html';
          reject(new Error('User not authenticated'));
        }
      });
    });
  }

  updateUserInfo(user) {
    const usernameElement = document.querySelector('.admin-username');
    if (usernameElement) {
      usernameElement.textContent = user.displayName || user.email || 'المدير';
    }
  }



  initializeNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        this.showSection(section);
      });
    });
  }

  showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
      section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.admin-nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
      targetSection.classList.add('active');
    }
    
    // Add active class to nav link
    const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
    
    this.currentSection = sectionName;
    
    // Load section-specific data
    this.loadSectionData(sectionName);
  }

  async loadSectionData(sectionName) {
    switch (sectionName) {
      case 'dashboard':
        await this.loadDashboardData();
        break;
      case 'articles':
        await this.loadArticles();
        break;
      case 'categories':
        await this.loadCategories();
        break;
      case 'media':
        await this.loadMedia();
        break;
      case 'users':
        await this.loadUsers();
        break;
      case 'analytics':
        this.initializeAnalytics();
        break;
      case 'settings':
        this.loadSettings();
        break;
    }
  }

  initializeEventListeners() {
    // Preview site button
    const previewBtn = document.getElementById('preview-site');
    if (previewBtn) {
      previewBtn.addEventListener('click', () => {
        window.open('../index.html', '_blank');
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('admin-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }

    // Article editor
    const addArticleBtn = document.getElementById('add-article-btn');
    if (addArticleBtn) {
      addArticleBtn.addEventListener('click', () => {
        this.openArticleEditor();
      });
    }

    const closeEditorBtn = document.getElementById('close-editor');
    if (closeEditorBtn) {
      closeEditorBtn.addEventListener('click', () => {
        this.closeArticleEditor();
      });
    }

    // Article form
    const articleForm = document.getElementById('article-form');
    if (articleForm) {
      articleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveArticle();
      });
    }

    // Search functionality
    const searchInput = document.getElementById('articles-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.debounce(() => this.filterArticles(), 300);
      });
    }

    // Filters
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        this.filters.category = e.target.value;
        this.filterArticles();
      });
    }

    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.filters.status = e.target.value;
        this.filterArticles();
      });
    }

    // Image upload preview
    const imageInput = document.getElementById('article-image');
    if (imageInput) {
      imageInput.addEventListener('change', (e) => {
        this.handleImagePreview(e);
      });
    }

    // Modal close on outside click
    const modal = document.getElementById('article-editor-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeArticleEditor();
        }
      });
    }
  }

  initializeQuillEditor() {
    const editorElement = document.getElementById('article-editor');
    if (editorElement && typeof Quill !== 'undefined') {
      this.quill = new Quill('#article-editor', {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
          ]
        },
        placeholder: 'ابدأ بكتابة محتوى المقال هنا...'
      });
    }
  }

  initializeSelect2() {
    // Initialize Select2 for category select
    const categorySelect = document.getElementById('article-category');
    if (categorySelect && typeof $ !== 'undefined') {
      $(categorySelect).select2({
        placeholder: 'اختر الفئة',
        allowClear: true,
        dir: 'rtl'
      });
    }
  }

  async loadDashboardData() {
    try {
      // Load statistics
      const stats = await this.getStatistics();
      this.updateDashboardStats(stats);
      
      // Load recent articles
      const recentArticles = await this.getRecentArticles();
      this.renderRecentArticles(recentArticles);
      
      // Load popular articles
      const popularArticles = await this.getPopularArticles();
      this.renderPopularArticles(popularArticles);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  updateDashboardStats(stats) {
    const elements = {
      'total-articles': stats.totalArticles || 0,
      'total-views': stats.totalViews || 0,
      'total-users': stats.totalUsers || 0,
      'total-categories': stats.totalCategories || 0
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        this.animateCounter(element, value);
      }
    });
  }

  animateCounter(element, target) {
    const start = 0;
    const duration = 1000;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = this.formatNumber(Math.floor(current));
    }, 16);
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  renderRecentArticles(articles) {
    const container = document.getElementById('recent-articles');
    if (!container) return;

    const articlesHTML = articles.map(article => `
      <div class="admin-article-item">
        <img src="${article.image || '../images/placeholder.jpg'}" alt="${article.title}" class="admin-article-image">
        <div class="admin-article-info">
          <h4 class="admin-article-title">${article.title}</h4>
          <p class="admin-article-meta">${article.author} • ${this.formatDate(article.date)}</p>
        </div>
      </div>
    `).join('');

    container.innerHTML = articlesHTML;
  }

  renderPopularArticles(articles) {
    const container = document.getElementById('popular-articles');
    if (!container) return;

    const articlesHTML = articles.map(article => `
      <div class="admin-article-item">
        <img src="${article.image || '../images/placeholder.jpg'}" alt="${article.title}" class="admin-article-image">
        <div class="admin-article-info">
          <h4 class="admin-article-title">${article.title}</h4>
          <p class="admin-article-meta">${this.formatNumber(article.views)} مشاهدة</p>
        </div>
      </div>
    `).join('');

    container.innerHTML = articlesHTML;
  }

  async loadArticles() {
    try {
      // محاولة تحميل المقالات من Firebase أولاً
      const firebaseResult = await firebaseService.getArticles();
      if (firebaseResult.success && firebaseResult.data && firebaseResult.data.length > 0) {
        this.articles = firebaseResult.data;
        console.log('تم تحميل المقالات من Firebase:', this.articles.length);
      } else {
        // استخدام البيانات المحلية كاحتياطي
        this.articles = this.getArticlesFromStorage();
        console.log('تم تحميل المقالات من LocalStorage:', this.articles.length);
      }
      
      this.renderArticlesTable();
      this.updateArticlesCount();
      this.populateCategoryFilters();
    } catch (error) {
      console.error('Error loading articles:', error);
      // استخدام البيانات المحلية في حالة الخطأ
      this.articles = this.getArticlesFromStorage();
      this.renderArticlesTable();
      this.updateArticlesCount();
      this.populateCategoryFilters();
    }
  }

  getArticlesFromStorage() {
    const stored = localStorage.getItem('alphaknow_articles');
    return stored ? JSON.parse(stored) : this.getDefaultArticles();
  }

  getDefaultArticles() {
    return [
      {
        id: 1,
        title: 'ريادة الأعمال الرقمية: دليل شامل للمبتدئين',
        excerpt: 'تعرف على أساسيات ريادة الأعمال الرقمية وكيفية البدء في مشروعك الأول',
        content: '<p>محتوى المقال هنا...</p>',
        image: '../images/article-1.jpg',
        author: 'فريق AlphaKnow',
        date: '2024-01-15',
        category: 'entrepreneurship',
        status: 'published',
        views: 1250,
        tags: ['ريادة الأعمال', 'الرقمية', 'المبتدئين']
      },
      {
        id: 2,
        title: 'التجارة الإلكترونية: من الصفر إلى الربح',
        excerpt: 'دليل عملي لإنشاء متجر إلكتروني ناجح وتحقيق الأرباح',
        content: '<p>محتوى المقال هنا...</p>',
        image: '../images/article-2.jpg',
        author: 'فريق AlphaKnow',
        date: '2024-01-10',
        category: 'ecommerce',
        status: 'published',
        views: 980,
        tags: ['التجارة الإلكترونية', 'المتجر', 'الربح']
      },
      {
        id: 3,
        title: 'التسويق الرقمي: استراتيجيات فعالة للترويج',
        excerpt: 'أفضل استراتيجيات التسويق الرقمي لزيادة مبيعاتك ووصولك للعملاء',
        content: '<p>محتوى المقال هنا...</p>',
        image: '../images/article-3.jpg',
        author: 'فريق AlphaKnow',
        date: '2024-01-05',
        category: 'marketing',
        status: 'draft',
        views: 1560,
        tags: ['التسويق الرقمي', 'الترويج', 'المبيعات']
      }
    ];
  }

  renderArticlesTable() {
    const tbody = document.getElementById('articles-tbody');
    if (!tbody) return;

    const filteredArticles = this.filterArticlesData();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    const articlesHTML = paginatedArticles.map(article => `
      <tr>
        <td>
          <img src="${article.image || '../images/placeholder.jpg'}" alt="${article.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 0.25rem;">
        </td>
        <td>
          <div>
            <strong>${article.title}</strong>
            <br>
            <small class="admin-text-muted">${article.excerpt}</small>
          </div>
        </td>
        <td>
          <span class="admin-status admin-status-${this.getCategoryColor(article.category)}">${this.getCategoryName(article.category)}</span>
        </td>
        <td>${article.author}</td>
        <td>${this.formatDate(article.date)}</td>
        <td>${this.formatNumber(article.views)}</td>
        <td>
          <span class="admin-status admin-status-${article.status}">${this.getStatusName(article.status)}</span>
        </td>
        <td>
          <div class="admin-actions-group">
            <button class="admin-action-btn admin-action-btn-view" onclick="adminPanel.viewArticle(${article.id})" title="عرض">
              <i class="fas fa-eye"></i>
            </button>
            <button class="admin-action-btn admin-action-btn-edit" onclick="adminPanel.editArticle(${article.id})" title="تعديل">
              <i class="fas fa-edit"></i>
            </button>
            <button class="admin-action-btn admin-action-btn-delete" onclick="adminPanel.deleteArticle(${article.id})" title="حذف">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.innerHTML = articlesHTML;
    this.renderPagination(filteredArticles.length);
  }

  filterArticlesData() {
    let filtered = [...this.articles];

    // Search filter
    if (this.searchQuery) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (this.filters.category) {
      filtered = filtered.filter(article => article.category === this.filters.category);
    }

    // Status filter
    if (this.filters.status) {
      filtered = filtered.filter(article => article.status === this.filters.status);
    }

    return filtered;
  }

  filterArticles() {
    this.currentPage = 1;
    this.renderArticlesTable();
  }

  renderPagination(totalItems) {
    const pagination = document.getElementById('articles-pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    if (totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
      <button class="admin-pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="adminPanel.goToPage(${this.currentPage - 1})">
        السابق
      </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
        paginationHTML += `
          <button class="admin-pagination-btn ${i === this.currentPage ? 'active' : ''}" onclick="adminPanel.goToPage(${i})">
            ${i}
          </button>
        `;
      } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
        paginationHTML += '<span>...</span>';
      }
    }

    // Next button
    paginationHTML += `
      <button class="admin-pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="adminPanel.goToPage(${this.currentPage + 1})">
        التالي
      </button>
    `;

    pagination.innerHTML = paginationHTML;
  }

  goToPage(page) {
    this.currentPage = page;
    this.renderArticlesTable();
  }

  updateArticlesCount() {
    const countElement = document.getElementById('articles-count');
    if (countElement) {
      countElement.textContent = this.articles.length;
    }
  }

  openArticleEditor(articleId = null) {
    const modal = document.getElementById('article-editor-modal');
    const title = document.getElementById('editor-title');
    
    if (modal) {
      modal.classList.add('active');
      
      if (articleId) {
        title.textContent = 'تعديل المقال';
        this.loadArticleForEdit(articleId);
      } else {
        title.textContent = 'إضافة مقال جديد';
        this.resetArticleForm();
      }
    }
  }

  closeArticleEditor() {
    const modal = document.getElementById('article-editor-modal');
    if (modal) {
      modal.classList.remove('active');
      this.resetArticleForm();
    }
  }

  resetArticleForm() {
    const form = document.getElementById('article-form');
    if (form) {
      form.reset();
    }
    
    if (this.quill) {
      this.quill.setText('');
    }
    
    const imagePreview = document.getElementById('image-preview');
    if (imagePreview) {
      imagePreview.innerHTML = '';
    }
  }

  loadArticleForEdit(articleId) {
    const article = this.articles.find(a => a.id === articleId);
    if (!article) return;

    // Fill form fields
    const titleInput = document.getElementById('article-title');
    const excerptInput = document.getElementById('article-excerpt');
    const categorySelect = document.getElementById('article-category');
    const statusSelect = document.getElementById('article-status');
    const tagsInput = document.getElementById('article-tags');

    if (titleInput) titleInput.value = article.title;
    if (excerptInput) excerptInput.value = article.excerpt;
    if (categorySelect) categorySelect.value = article.category;
    if (statusSelect) statusSelect.value = article.status;
    if (tagsInput) tagsInput.value = article.tags.join(', ');

    // Set editor content
    if (this.quill) {
      this.quill.root.innerHTML = article.content;
    }

    // Show image preview
    if (article.image) {
      this.showImagePreview(article.image);
    }

    // Store article ID for update
    form.dataset.articleId = articleId;
  }

  async saveArticle() {
    try {
      const form = document.getElementById('article-form');
      const formData = new FormData(form);
      
      const articleData = {
        title: formData.get('title'),
        excerpt: formData.get('excerpt'),
        category: formData.get('category'),
        status: formData.get('status'),
        tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
        content: this.quill ? this.quill.root.innerHTML : '',
        image: this.currentImageUrl || '',
        author: 'فريق AlphaKnow',
        date: new Date().toISOString().split('T')[0],
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const articleId = form.dataset.articleId;
      
      if (articleId) {
        // تحديث مقال موجود
        try {
          const updateResult = await firebaseService.updateArticle(articleId, articleData);
          if (updateResult.success) {
            // تحديث القائمة المحلية
            const index = this.articles.findIndex(a => a.id === articleId);
            if (index !== -1) {
              this.articles[index] = { ...this.articles[index], ...articleData };
            }
            this.showSuccess('تم تحديث المقال بنجاح');
          } else {
            throw new Error(updateResult.error);
          }
        } catch (error) {
          console.error('Firebase update failed, using localStorage:', error);
          // استخدام LocalStorage كاحتياطي
          const index = this.articles.findIndex(a => a.id === parseInt(articleId));
          if (index !== -1) {
            this.articles[index] = { ...this.articles[index], ...articleData };
          }
          this.saveArticlesToStorage();
          this.showSuccess('تم تحديث المقال بنجاح (محلي)');
        }
      } else {
        // إضافة مقال جديد
        try {
          const createResult = await firebaseService.createArticle(articleData);
          if (createResult.success) {
            // إضافة المقال الجديد للقائمة المحلية
            const newArticle = { ...articleData, id: createResult.id };
            this.articles.unshift(newArticle);
            this.showSuccess('تم إضافة المقال بنجاح');
          } else {
            throw new Error(createResult.error);
          }
        } catch (error) {
          console.error('Firebase create failed, using localStorage:', error);
          // استخدام LocalStorage كاحتياطي
          articleData.id = this.getNextArticleId();
          this.articles.unshift(articleData);
          this.saveArticlesToStorage();
          this.showSuccess('تم إضافة المقال بنجاح (محلي)');
        }
      }
      
      // تحديث الواجهة
      this.renderArticlesTable();
      this.updateArticlesCount();
      this.closeArticleEditor();
      
    } catch (error) {
      console.error('Error saving article:', error);
      this.showError('حدث خطأ أثناء حفظ المقال');
    }
  }

  getNextArticleId() {
    return Math.max(...this.articles.map(a => a.id), 0) + 1;
  }

  saveArticlesToStorage() {
    localStorage.setItem('alphaknow_articles', JSON.stringify(this.articles));
  }

  handleImagePreview(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.currentImageUrl = e.target.result;
        this.showImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  showImagePreview(imageUrl) {
    const preview = document.getElementById('image-preview');
    if (preview) {
      preview.innerHTML = `<img src="${imageUrl}" alt="معاينة الصورة">`;
    }
  }

  viewArticle(articleId) {
    const article = this.articles.find(a => a.id === articleId);
    if (article) {
      // Open article in new tab
      window.open(`../article.html?id=${articleId}`, '_blank');
    }
  }

  editArticle(articleId) {
    this.openArticleEditor(articleId);
  }

  deleteArticle(articleId) {
    if (confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      this.articles = this.articles.filter(a => a.id !== articleId);
      this.saveArticlesToStorage();
      this.renderArticlesTable();
      this.updateArticlesCount();
      this.showSuccess('تم حذف المقال بنجاح');
    }
  }

  async loadCategories() {
    try {
      this.categories = this.getCategoriesFromStorage();
      this.renderCategoriesGrid();
      this.updateCategoriesCount();
      this.populateCategoryFilters();
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  getCategoriesFromStorage() {
    const stored = localStorage.getItem('alphaknow_categories');
    return stored ? JSON.parse(stored) : this.getDefaultCategories();
  }

  getDefaultCategories() {
    return [
      { id: 'entrepreneurship', name: 'ريادة الأعمال', color: '#1a365d', icon: 'layers', count: 5 },
      { id: 'ecommerce', name: 'التجارة الإلكترونية', color: '#3182ce', icon: 'shopping-cart', count: 3 },
      { id: 'marketing', name: 'التسويق الرقمي', color: '#38a169', icon: 'megaphone', count: 4 },
      { id: 'freelancing', name: 'العمل الحر', color: '#d69e2e', icon: 'briefcase', count: 2 },
      { id: 'investment', name: 'الاستثمار الرقمي', color: '#e53e3e', icon: 'trending-up', count: 1 },
      { id: 'tools', name: 'الأدوات والموارد', color: '#805ad5', icon: 'tool', count: 3 }
    ];
  }

  renderCategoriesGrid() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    const categoriesHTML = this.categories.map(category => `
      <div class="admin-category-card">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
          <div style="width: 50px; height: 50px; background-color: ${category.color}; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: white;">
            <i class="fas fa-${category.icon}"></i>
          </div>
          <div>
            <h3 style="margin: 0; font-size: 1.125rem; font-weight: 600;">${category.name}</h3>
            <p style="margin: 0.25rem 0 0 0; color: var(--admin-text-secondary); font-size: 0.875rem;">
              ${category.count} مقال
            </p>
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="admin-btn admin-btn-secondary" onclick="adminPanel.editCategory('${category.id}')">
            <i class="fas fa-edit"></i>
            تعديل
          </button>
          <button class="admin-btn admin-btn-danger" onclick="adminPanel.deleteCategory('${category.id}')">
            <i class="fas fa-trash"></i>
            حذف
          </button>
        </div>
      </div>
    `).join('');

    grid.innerHTML = categoriesHTML;
  }

  updateCategoriesCount() {
    const countElement = document.getElementById('categories-count');
    if (countElement) {
      countElement.textContent = this.categories.length;
    }
  }

  populateCategoryFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const articleCategory = document.getElementById('article-category');
    
    const options = this.categories.map(category => 
      `<option value="${category.id}">${category.name}</option>`
    ).join('');
    
    if (categoryFilter) {
      categoryFilter.innerHTML = '<option value="">جميع الفئات</option>' + options;
    }
    
    if (articleCategory) {
      articleCategory.innerHTML = '<option value="">اختر الفئة</option>' + options;
    }
  }

  async loadUsers() {
    try {
      this.users = this.getUsersFromStorage();
      this.renderUsersTable();
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  getUsersFromStorage() {
    const stored = localStorage.getItem('alphaknow_users');
    return stored ? JSON.parse(stored) : this.getDefaultUsers();
  }

  getDefaultUsers() {
    return [
      {
        id: 1,
        name: 'مدير النظام',
        email: 'admin@alphaknow.com',
        role: 'admin',
        avatar: '../images/admin-avatar.jpg',
        status: 'active',
        registeredDate: '2024-01-01'
      },
      {
        id: 2,
        name: 'كاتب المحتوى',
        email: 'writer@alphaknow.com',
        role: 'writer',
        avatar: '../images/writer-avatar.jpg',
        status: 'active',
        registeredDate: '2024-01-05'
      }
    ];
  }

  renderUsersTable() {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;

    const usersHTML = this.users.map(user => `
      <tr>
        <td>
          <img src="${user.avatar || '../images/default-avatar.jpg'}" alt="${user.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
        </td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <span class="admin-status admin-status-${user.role === 'admin' ? 'published' : 'draft'}">
            ${user.role === 'admin' ? 'مدير' : 'كاتب'}
          </span>
        </td>
        <td>${this.formatDate(user.registeredDate)}</td>
        <td>
          <span class="admin-status admin-status-${user.status === 'active' ? 'published' : 'archived'}">
            ${user.status === 'active' ? 'نشط' : 'غير نشط'}
          </span>
        </td>
        <td>
          <div class="admin-actions-group">
            <button class="admin-action-btn admin-action-btn-edit" onclick="adminPanel.editUser(${user.id})" title="تعديل">
              <i class="fas fa-edit"></i>
            </button>
            <button class="admin-action-btn admin-action-btn-delete" onclick="adminPanel.deleteUser(${user.id})" title="حذف">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.innerHTML = usersHTML;
  }

  async loadMedia() {
    try {
      this.media = this.getMediaFromStorage();
      this.renderMediaGrid();
    } catch (error) {
      console.error('Error loading media:', error);
    }
  }

  getMediaFromStorage() {
    const stored = localStorage.getItem('alphaknow_media');
    return stored ? JSON.parse(stored) : this.getDefaultMedia();
  }

  getDefaultMedia() {
    return [
      {
        id: 1,
        name: 'hero-image.jpg',
        url: '../images/hero-image.jpg',
        type: 'image',
        size: '2.5 MB',
        uploadedDate: '2024-01-15'
      },
      {
        id: 2,
        name: 'logo.png',
        url: '../images/logo.png',
        type: 'image',
        size: '150 KB',
        uploadedDate: '2024-01-10'
      }
    ];
  }

  renderMediaGrid() {
    const grid = document.getElementById('media-grid');
    if (!grid) return;

    const mediaHTML = this.media.map(item => `
      <div class="admin-media-item">
        <img src="${item.url}" alt="${item.name}" class="admin-media-preview">
        <div class="admin-media-info">
          <h4 class="admin-media-name">${item.name}</h4>
          <p class="admin-media-meta">${item.size} • ${this.formatDate(item.uploadedDate)}</p>
        </div>
      </div>
    `).join('');

    grid.innerHTML = mediaHTML;
  }

  initializeAnalytics() {
    // Initialize charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
      this.initializeVisitsChart();
      this.initializeArticlesChart();
    }
  }

  initializeVisitsChart() {
    const ctx = document.getElementById('visits-chart');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        datasets: [{
          label: 'الزيارات',
          data: [1200, 1900, 3000, 5000, 2000, 3000],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  }

  initializeArticlesChart() {
    const ctx = document.getElementById('articles-chart');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['ريادة الأعمال', 'التجارة الإلكترونية', 'التسويق الرقمي', 'العمل الحر'],
        datasets: [{
          data: [5, 3, 4, 2],
          backgroundColor: [
            '#1a365d',
            '#3182ce',
            '#38a169',
            '#d69e2e'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          }
        }
      }
    });
  }

  loadSettings() {
    // Load settings from localStorage
    const settings = this.getSettingsFromStorage();
    
    // Populate form fields
    const siteTitle = document.getElementById('site-title');
    const siteDescription = document.getElementById('site-description');
    const metaKeywords = document.getElementById('meta-keywords');
    const googleAnalytics = document.getElementById('google-analytics');
    
    if (siteTitle) siteTitle.value = settings.siteTitle || '';
    if (siteDescription) siteDescription.value = settings.siteDescription || '';
    if (metaKeywords) metaKeywords.value = settings.metaKeywords || '';
    if (googleAnalytics) googleAnalytics.value = settings.googleAnalytics || '';
  }

  getSettingsFromStorage() {
    const stored = localStorage.getItem('alphaknow_settings');
    return stored ? JSON.parse(stored) : {};
  }

  saveSettingsToStorage(settings) {
    localStorage.setItem('alphaknow_settings', JSON.stringify(settings));
  }

  // Utility methods
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  }

  getCategoryName(categoryId) {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  }

  getCategoryColor(categoryId) {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.color : '#64748b';
  }

  getStatusName(status) {
    const statusMap = {
      'published': 'منشور',
      'draft': 'مسودة',
      'archived': 'مؤرشف'
    };
    return statusMap[status] || status;
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `admin-notification admin-notification-${type}`;
    notification.innerHTML = `
      <div class="admin-notification-content">
        <div class="admin-notification-message">${message}</div>
        <button class="admin-notification-close">&times;</button>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto hide after 5 seconds
    setTimeout(() => this.hideNotification(notification), 5000);

    // Close button
    notification.querySelector('.admin-notification-close').addEventListener('click', () => {
      this.hideNotification(notification);
    });
  }

  hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  async logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      try {
        await firebaseService.signOut();
        this.showSuccess('تم تسجيل الخروج بنجاح');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1000);
      } catch (error) {
        this.showError('حدث خطأ أثناء تسجيل الخروج');
        console.error('Logout error:', error);
      }
    }
  }

  // Mock API methods (replace with real API calls)
  async getStatistics() {
    return {
      totalArticles: this.articles.length,
      totalViews: this.articles.reduce((sum, article) => sum + article.views, 0),
      totalUsers: this.users.length,
      totalCategories: this.categories.length
    };
  }

  async getRecentArticles() {
    return this.articles.slice(0, 5);
  }

  async getPopularArticles() {
    return this.articles
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }
}

// Initialize admin panel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.adminPanel = new AdminPanel();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminPanel;
} 