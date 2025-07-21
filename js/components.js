// Component utilities and handlers
const COMPONENTS = {
  // Article card component
  createArticleCard: (article) => {
    return `
      <article class="article-card" data-category="${article.category}">
        <div class="article-image">
          <img src="${article.image}" alt="${article.title}" loading="lazy">
          <div class="article-category">${article.categoryName}</div>
        </div>
        <div class="article-content">
          <h3 class="article-title">
            <a href="article.html?id=${article.id}">${article.title}</a>
          </h3>
          <p class="article-excerpt">${article.excerpt}</p>
          <div class="article-meta">
            <span class="article-author">${article.author}</span>
            <span class="article-date">${UTILS.date.formatArabic(article.date)}</span>
            <span class="article-read-time">${article.readTime} دقائق قراءة</span>
          </div>
        </div>
      </article>
    `;
  },

  // Category card component
  createCategoryCard: (category) => {
    return `
      <div class="category-card">
        <div class="category-icon">
          ${category.icon}
        </div>
        <h3 class="category-title">${category.name}</h3>
        <p class="category-description">${category.description}</p>
        <div class="category-stats">
          <span class="articles-count">${category.articleCount}+ مقال</span>
        </div>
        <a href="category.html?cat=${category.slug}" class="category-link">
          استكشف الآن
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 17L17 7M17 7H7M17 7V17"></path>
          </svg>
        </a>
      </div>
    `;
  },

  // Testimonial component
  createTestimonial: (testimonial) => {
    return `
      <div class="testimonial-card">
        <div class="testimonial-rating">
          ${'★'.repeat(testimonial.rating)}
        </div>
        <blockquote class="testimonial-text">
          "${testimonial.text}"
        </blockquote>
        <div class="testimonial-author">
          <div class="author-avatar">
            <img src="${testimonial.avatar}" alt="${testimonial.name}" loading="lazy">
          </div>
          <div class="author-info">
            <h4 class="author-name">${testimonial.name}</h4>
            <p class="author-title">${testimonial.title}</p>
          </div>
        </div>
      </div>
    `;
  },

  // Loading spinner component
  createLoadingSpinner: () => {
    return `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    `;
  },

  // Error message component
  createErrorMessage: (message) => {
    return `
      <div class="error-message">
        <div class="error-icon">⚠️</div>
        <p>${message}</p>
      </div>
    `;
  },

  // Success message component
  createSuccessMessage: (message) => {
    return `
      <div class="success-message">
        <div class="success-icon">✅</div>
        <p>${message}</p>
      </div>
    `;
  },

  // Modal component
  createModal: (title, content, actions = []) => {
    const actionsHTML = actions.map(action => 
      `<button class="btn ${action.class || 'btn-primary'}" onclick="${action.onclick}">${action.text}</button>`
    ).join('');

    return `
      <div class="modal-overlay" onclick="COMPONENTS.closeModal()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-close" onclick="COMPONENTS.closeModal()">×</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          <div class="modal-footer">
            ${actionsHTML}
          </div>
        </div>
      </div>
    `;
  },

  // Show modal
  showModal: (title, content, actions) => {
    const modal = COMPONENTS.createModal(title, content, actions);
    document.body.insertAdjacentHTML('beforeend', modal);
    document.body.classList.add('modal-open');
  },

  // Close modal
  closeModal: () => {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.remove();
      document.body.classList.remove('modal-open');
    }
  },

  // Toast notification
  showToast: (message, type = 'info', duration = 3000) => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // Pagination component
  createPagination: (currentPage, totalPages, baseUrl) => {
    let pagination = '<div class="pagination">';
    
    // Previous button
    if (currentPage > 1) {
      pagination += `<a href="${baseUrl}?page=${currentPage - 1}" class="pagination-btn">السابق</a>`;
    }
    
    // Page numbers
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      const activeClass = i === currentPage ? 'active' : '';
      pagination += `<a href="${baseUrl}?page=${i}" class="pagination-btn ${activeClass}">${i}</a>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
      pagination += `<a href="${baseUrl}?page=${currentPage + 1}" class="pagination-btn">التالي</a>`;
    }
    
    pagination += '</div>';
    return pagination;
  },

  // Search results component
  createSearchResults: (results, query) => {
    if (results.length === 0) {
      return `
        <div class="search-no-results">
          <h3>لم يتم العثور على نتائج</h3>
          <p>لم نجد أي مقالات تحتوي على "${query}"</p>
          <p>جرب البحث بكلمات مختلفة أو تصفح الفئات المختلفة</p>
        </div>
      `;
    }

    return `
      <div class="search-results">
        <h3>نتائج البحث عن "${query}" (${results.length} نتيجة)</h3>
        <div class="search-results-grid">
          ${results.map(article => COMPONENTS.createArticleCard(article)).join('')}
        </div>
      </div>
    `;
  }
};

