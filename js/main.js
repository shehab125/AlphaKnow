// Main JavaScript File
class DigitalEntrepreneurshipBlog {
  constructor() {
    this.init();
  }

  async init() {
    try {
      // Mark performance start
      UTILS.performance.mark('app-start');

      // Initialize core components
      await this.initializeApp();
      
      // Load articles data
      await this.loadArticles();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize animations
      this.initializeAnimations();
      
      // Setup theme
      this.initializeTheme();
      
      // Initialize search
      this.initializeSearch();
      
      // Setup newsletter
      this.initializeNewsletter();
      
      // Initialize testimonials
      this.initializeTestimonials();
      
      // Setup scroll effects
      this.initializeScrollEffects();
      
      // Hide loading screen
      this.hideLoadingScreen();
      
      // Mark performance end
      UTILS.performance.mark('app-end');
      UTILS.performance.measure('app-initialization', 'app-start', 'app-end');
      
      console.log('✅ Digital Entrepreneurship Blog initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing blog:', error);
      this.handleInitializationError(error);
    }
  }

  async initializeApp() {
    // Set document direction and language
    document.documentElement.setAttribute('dir', CONFIG.site.direction);
    document.documentElement.setAttribute('lang', CONFIG.site.language);
    
    // Update visit count
    this.updateVisitCount();
    
    // Initialize service worker if supported
    if (CONFIG.performance.enableServiceWorker && 'serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }

  async loadArticles() {
    try {
      const response = await fetch(CONFIG.api.articles);
      if (!response.ok) throw new Error('Failed to load articles');
      
      this.articlesData = await response.json();
      this.renderFeaturedArticles();
      this.updateStats();
    } catch (error) {
      console.error('Error loading articles:', error);
      this.showError('فشل في تحميل المقالات. يرجى إعادة تحميل الصفحة.');
    }
  }

  renderFeaturedArticles() {
    const container = document.getElementById('featured-articles-grid');
    if (!container || !this.articlesData?.featured) return;

    const articlesHTML = this.articlesData.featured.slice(0, 6).map(article => 
      this.createArticleCard(article)
    ).join('');

    container.innerHTML = articlesHTML;
    
    // Add stagger animation
    const cards = container.querySelectorAll('.article-card');
    cards.forEach((card, index) => {
      card.classList.add('fade-in-observer');
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  createArticleCard(article) {
    const readTime = article.readTime || 5;
    const views = this.formatNumber(article.views || 0);
    const publishedDate = UTILS.formatDate(article.publishedAt);
    const relativeTime = UTILS.getRelativeTime(article.publishedAt);
    const categoryName = CONFIG.categories[article.category]?.name || article.category;

    return `
      <article class="article-card hover-lift">
        <div class="article-card-image">
          <img src="${article.image}" alt="${article.title}" loading="lazy">
          <div class="article-card-category">${categoryName}</div>
        </div>
        <div class="article-card-content">
          <h3 class="article-card-title">
            <a href="article.html?slug=${article.slug}">${article.title}</a>
          </h3>
          <p class="article-card-excerpt">${article.excerpt}</p>
          <div class="article-card-meta">
            <div class="article-card-author">
              <img src="${article.author.avatar}" alt="${article.author.name}" width="24" height="24" style="border-radius: 50%;">
              <span>${article.author.name}</span>
            </div>
            <div class="article-card-stats">
              <span class="article-card-date" title="${publishedDate}">${relativeTime}</span>
              <span class="article-card-read-time">${readTime} دقائق</span>
              <span class="article-card-views">${views} مشاهدة</span>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  updateStats() {
    const stats = this.articlesData?.stats;
    if (!stats) return;

    // Animate counters
    this.animateCounter('stat-number[data-count="50000"]', 50000);
    this.animateCounter('stat-number[data-count="1200"]', stats.totalArticles || 1200);
    this.animateCounter('stat-number[data-count="25"]', 25);
    this.animateCounter('stat-number[data-count="98"]', 98);
  }

  animateCounter(selector, target) {
    const element = document.querySelector(selector);
    if (!element) return;

    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString('ar-SA');
    }, 20);
  }

  setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    
    if (mobileMenuToggle && navbarMenu) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navbarMenu.classList.toggle('active');
      });
    }

    // Search toggle
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    
    if (searchToggle && searchOverlay) {
      searchToggle.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        document.getElementById('search-input')?.focus();
      });
    }
    
    if (searchClose && searchOverlay) {
      searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
      });
    }

    // Close search on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay?.classList.contains('active')) {
        searchOverlay.classList.remove('active');
      }
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Smooth scroll for anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar') && navbarMenu?.classList.contains('active')) {
        mobileMenuToggle?.classList.remove('active');
        navbarMenu.classList.remove('active');
      }
    });
  }

  initializeAnimations() {
    // Skip animations if user prefers reduced motion
    if (UTILS.prefersReducedMotion()) return;

    // Intersection Observer for scroll animations
    const observerOptions = CONFIG.animations.observerOptions;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-observer, .scale-in-observer, .slide-in-left-observer, .slide-in-right-observer');
    animatedElements.forEach(el => observer.observe(el));

    // Add parallax effect to hero background
    this.initializeParallax();
  }

  initializeParallax() {
    const heroPattern = document.querySelector('.hero-pattern');
    if (!heroPattern) return;

    const handleScroll = UTILS.throttle(() => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      heroPattern.style.transform = `translateY(${rate}px)`;
    }, 16);

    window.addEventListener('scroll', handleScroll);
  }

  initializeTheme() {
    // Get saved theme or system preference
    const savedTheme = UTILS.storage.get(CONFIG.storage.theme);
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || (CONFIG.theme.systemPreference ? systemTheme : CONFIG.theme.default);
    
    this.setTheme(theme);

    // Listen for system theme changes
    if (CONFIG.theme.systemPreference) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!UTILS.storage.get(CONFIG.storage.theme)) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    UTILS.storage.set(CONFIG.storage.theme, theme);
    
    // Update theme toggle icon
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const sunIcon = themeToggle.querySelector('.sun-icon');
      const moonIcon = themeToggle.querySelector('.moon-icon');
      
      if (theme === 'dark') {
        sunIcon?.style.setProperty('display', 'none');
        moonIcon?.style.setProperty('display', 'block');
      } else {
        sunIcon?.style.setProperty('display', 'block');
        moonIcon?.style.setProperty('display', 'none');
      }
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.getElementById('search-suggestions');
    
    if (!searchInput || !searchSuggestions) return;

    const debouncedSearch = UTILS.debounce(async (query) => {
      if (query.length < CONFIG.search.minQueryLength) {
        searchSuggestions.style.display = 'none';
        return;
      }

      try {
        const results = await this.performSearch(query);
        this.displaySearchSuggestions(results, searchSuggestions);
      } catch (error) {
        console.error('Search error:', error);
      }
    }, CONFIG.search.debounceDelay);

    searchInput.addEventListener('input', (e) => {
      debouncedSearch(e.target.value.trim());
    });

    // Handle search form submission
    const searchForm = searchInput.closest('form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
      });
    }
  }

  async performSearch(query) {
    // Simple client-side search for demo
    if (!this.articlesData) return [];

    const allArticles = [
      ...this.articlesData.featured,
      ...this.articlesData.recent,
      ...this.articlesData.popular
    ];

    return allArticles.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      article.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, CONFIG.search.maxSuggestions);
  }

  displaySearchSuggestions(results, container) {
    if (results.length === 0) {
      container.style.display = 'none';
      return;
    }

    const suggestionsHTML = results.map(article => `
      <div class="search-suggestion">
        <a href="article.html?slug=${article.slug}" class="search-suggestion-link">
          <div class="search-suggestion-title">${article.title}</div>
          <div class="search-suggestion-category">${CONFIG.categories[article.category]?.name}</div>
        </a>
      </div>
    `).join('');

    container.innerHTML = suggestionsHTML;
    container.style.display = 'block';
  }

  initializeNewsletter() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(newsletterForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        interest: formData.get('interest')
      };

      // Validate form
      if (!this.validateNewsletterForm(data)) return;

      // Show loading state
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        this.showSuccess(CONFIG.newsletter.successMessage);
        newsletterForm.reset();
        
        // Track subscription
        this.trackNewsletterSubscription(data);
        
      } catch (error) {
        console.error('Newsletter subscription error:', error);
        this.showError(CONFIG.newsletter.errorMessage);
      } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  validateNewsletterForm(data) {
    const errors = [];

    if (!UTILS.isValidName(data.name)) {
      errors.push(CONFIG.newsletter.validationMessages.name);
    }

    if (!UTILS.isValidEmail(data.email)) {
      errors.push(CONFIG.newsletter.validationMessages.email);
    }

    if (!data.interest) {
      errors.push(CONFIG.newsletter.validationMessages.interest);
    }

    if (errors.length > 0) {
      this.showError(errors.join('<br>'));
      return false;
    }

    return true;
  }

  trackNewsletterSubscription(data) {
    // Track subscription for analytics
    if (CONFIG.analytics.enabled && typeof gtag !== 'undefined') {
      gtag('event', 'newsletter_subscription', {
        event_category: 'engagement',
        event_label: data.interest
      });
    }
  }

  initializeTestimonials() {
    const slider = document.getElementById('testimonials-slider');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    
    if (!slider || !prevBtn || !nextBtn) return;

    let currentSlide = 0;
    const slides = slider.querySelectorAll('.testimonial-card');
    const totalSlides = slides.length;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
      });
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
    };

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-play
    setInterval(nextSlide, 5000);

    // Initialize
    showSlide(0);
  }

  initializeScrollEffects() {
    // Progress bar
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      const updateProgress = UTILS.throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
      }, 16);

      window.addEventListener('scroll', updateProgress);
    }

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      const toggleBackToTop = UTILS.throttle(() => {
        if (window.pageYOffset > 300) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }, 100);

      window.addEventListener('scroll', toggleBackToTop);
    }

    // Header scroll effect
    const header = document.getElementById('header');
    if (header) {
      const handleHeaderScroll = UTILS.throttle(() => {
        if (window.pageYOffset > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, 100);

      window.addEventListener('scroll', handleHeaderScroll);
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, 1000);
    }
  }

  updateVisitCount() {
    const visitCount = UTILS.storage.get(CONFIG.storage.visitCount, 0);
    const lastVisit = UTILS.storage.get(CONFIG.storage.lastVisit);
    const now = UTILS.now();

    // Update visit count if it's a new day
    if (!lastVisit || now - lastVisit > 24 * 60 * 60 * 1000) {
      UTILS.storage.set(CONFIG.storage.visitCount, visitCount + 1);
      UTILS.storage.set(CONFIG.storage.lastVisit, now);
    }
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

  showError(message) {
    this.showNotification(message, 'error');
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-message">${message}</div>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto hide after 5 seconds
    setTimeout(() => this.hideNotification(notification), 5000);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
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

  handleInitializationError(error) {
    console.error('Initialization error:', error);
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }

    // Show error message
    this.showError('حدث خطأ أثناء تحميل الموقع. يرجى إعادة تحميل الصفحة.');
  }
}

// Initialize the blog when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.blog = new DigitalEntrepreneurshipBlog();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Page became visible, resume any paused operations
    console.log('Page became visible');
  } else {
    // Page became hidden, pause operations
    console.log('Page became hidden');
  }
});

// Handle online/offline status
window.addEventListener('online', () => {
  console.log('Connection restored');
  // Handle reconnection
});

window.addEventListener('offline', () => {
  console.log('Connection lost');
  // Handle offline mode
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DigitalEntrepreneurshipBlog;
}

