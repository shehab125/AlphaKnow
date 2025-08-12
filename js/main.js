// Fallback loading screen handler - runs immediately
(function() {
  // Hide loading screen after 10 seconds maximum as ultimate fallback
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
      console.warn('Ultimate fallback: Forcing loading screen to hide');
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        loadingScreen.style.pointerEvents = 'none';
      }, 500);
    }
  }, 10000);
})();

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
      
      // Load articles data (with timeout and fallback)
      try {
        await Promise.race([
          this.loadArticles(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Articles load timeout')), 5000)
          )
        ]);
      } catch (error) {
        console.warn('Articles failed to load, continuing with fallback data:', error);
        // Use fallback data or empty state
        this.articlesData = { featured: [], categories: [] };
      }
      
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
      // Try to load from Firebase first
      if (window.firebaseService && window.firebaseService.isFirebaseAvailable()) {
        console.log('🔄 Loading articles from Firebase...');
        const result = await firebaseService.getArticles();
        if (result.success && result.data.length > 0) {
          console.log(`✅ Loaded ${result.data.length} articles from Firebase`);
          this.articlesData = {
            featured: result.data.filter(article => article.status === 'published').slice(0, 6),
            categories: []
          };
          this.renderFeaturedArticles();
          this.updateStats();
          return;
        } else {
          console.log('ℹ️ No articles found in Firebase, trying local JSON...');
        }
      } else {
        console.log('⚠️ Firebase not available, using local JSON fallback');
      }
      
      // Fallback to local JSON file
      console.log('🔄 Loading articles from local JSON...');
      const response = await fetch(CONFIG.api.articles);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
      this.articlesData = await response.json();
      console.log(`✅ Loaded ${this.articlesData.featured?.length || 0} articles from local JSON`);
      this.renderFeaturedArticles();
      this.updateStats();
    } catch (error) {
      console.error('❌ Error loading articles:', error);
      
      // Use empty data instead of fallback dummy data
      console.log('ℹ️ Using empty articles state');
      this.articlesData = {
        featured: [],
        categories: []
      };
      
      this.renderFeaturedArticles();
      this.updateStats();
    }
  }

  renderFeaturedArticles() {
    const container = document.getElementById('featured-articles-grid');
    if (!container) return;

    const articles = this.articlesData?.featured || [];
    if (articles.length === 0) {
      container.innerHTML = `
        <div class="no-articles" role="status" aria-live="polite">
          لا توجد مقالات حالياً. سيتم عرض المقالات هنا عند إضافتها.
        </div>
      `;
      return;
    }

    const articlesHTML = articles.slice(0, 6).map(article => 
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
    const articles = this.articlesData?.featured || [];
    const statsSection = document.querySelector('.stats');
    if (!articles.length) {
      // Hide stats until real content exists
      if (statsSection) statsSection.style.display = 'none';
      this.updateCategoryStats();
      return;
    }

    if (statsSection) statsSection.style.removeProperty('display');

    const totalArticles = articles.length;
    const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalReaders = totalViews; // 1:1 fallback without fake inflation
    const satisfactionRate = 0; // Unknown without real feedback

    this.animateCounter('[data-count="15000"]', totalReaders);
    this.animateCounter('[data-count="350"]', totalArticles);
    this.animateCounter('[data-count="12"]', 0);
    this.animateCounter('[data-count="95"]', satisfactionRate);
    
    this.updateCategoryStats();
  }
  
  updateCategoryStats() {
    const articles = this.articlesData?.featured || [];
    
    // Count articles by category
    const categoryCount = {};
    articles.forEach(article => {
      const category = article.category || 'general';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    // Update category cards with realistic counts
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      const categoryLink = card.querySelector('a[href*="category="]');
      if (categoryLink) {
        const href = categoryLink.getAttribute('href');
        const categoryMatch = href.match(/category=([^&]+)/);
        if (categoryMatch) {
          const category = categoryMatch[1];
          const count = categoryCount[category] || 0;
          const displayCount = count; // No fake multipliers
          
          const countElement = card.querySelector('.category-count');
          if (countElement) {
            countElement.textContent = displayCount > 0 ? `${displayCount} مقال` : '';
          }
        }
      }
    });
  }
  
  // Removed fake multiplier logic

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
    const navbarMenu = document.getElementById('navbar-menu');
    
    const openMenu = () => {
      if (!navbarMenu) return;
      navbarMenu.classList.add('active');
      document.body.classList.add('menu-open');
      const toggleBtn = document.querySelector('#mobile-menu-toggle, #menu-toggle, .mobile-menu-toggle');
      toggleBtn?.classList.add('active');
      toggleBtn?.setAttribute('aria-expanded', 'true');
          navbarMenu.style.display = 'block';
          navbarMenu.style.transform = 'translateY(0)';
          navbarMenu.style.opacity = '1';
          navbarMenu.style.visibility = 'visible';
    };

    const closeMenu = () => {
      if (!navbarMenu) return;
          navbarMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
      const toggleBtn = document.querySelector('#mobile-menu-toggle, #menu-toggle, .mobile-menu-toggle');
      toggleBtn?.classList.remove('active');
      toggleBtn?.setAttribute('aria-expanded', 'false');
          navbarMenu.style.transform = 'translateY(-100%)';
          navbarMenu.style.opacity = '0';
          navbarMenu.style.visibility = 'hidden';
    };

    const toggleMenu = () => {
      if (!navbarMenu) return;
      if (navbarMenu.classList.contains('active')) closeMenu();
      else openMenu();
    };

    // Rebuilt: single delegated click handler for navbar controls
    document.addEventListener('click', (event) => {
      const target = event.target;

      // Menu toggle
      if (target.closest('#mobile-menu-toggle, #menu-toggle, .mobile-menu-toggle')) {
        event.preventDefault();
        event.stopPropagation();
        toggleMenu();
        return;
      }

      // Search open
      if (target.closest('#search-toggle')) {
        event.preventDefault();
        const overlay = document.getElementById('search-overlay');
        overlay?.classList.add('active');
        document.getElementById('search-input')?.focus();
        document.body.classList.add('menu-open');
        closeMenu();
        return;
      }

      // Search close (button or clicking backdrop)
      const overlay = document.getElementById('search-overlay');
      if (overlay && (target.closest('#search-close') || target === overlay)) {
        event.preventDefault();
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        return;
      }

    // Theme toggle
      if (target.closest('#theme-toggle')) {
        event.preventDefault();
        this.toggleTheme();
        return;
      }

      // Dropdown toggle on touch/small screens
      const dropdownToggle = target.closest('.dropdown > .dropdown-toggle');
      if (dropdownToggle) {
        // Prevent page jump
        event.preventDefault();
        const parent = dropdownToggle.closest('.dropdown');
        if (parent) {
          const open = parent.classList.toggle('open');
          dropdownToggle.setAttribute('aria-expanded', String(open));
          const menu = parent.querySelector('.dropdown-menu');
          if (menu) {
            // Toggle visibility for mobile where we want collapsible behavior
            if (open) {
              menu.style.display = 'block';
            } else {
              menu.style.display = 'none';
            }
          }
        }
        return;
      }

      // Clicking outside closes menu
      if (!target.closest('.navbar') && navbarMenu?.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close search on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const overlay = document.getElementById('search-overlay');
        if (overlay?.classList.contains('active')) {
          overlay.classList.remove('active');
          document.body.classList.remove('menu-open');
        }
        if (navbarMenu?.classList.contains('active')) closeMenu();
      }
    });

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Smooth scroll for anchor links, ignore plain "#"
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        const href = link.getAttribute('href');
        if (href && href.length > 1) {
        e.preventDefault();
          const target = document.querySelector(href);
          target?.scrollIntoView({ behavior: 'smooth' });
        }
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

// SEO Enhancement: Add structured data for articles
function addArticleStructuredData(article) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.excerpt,
      "image": article.image,
      "author": {
        "@type": "Person",
        "name": article.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "ريادة الأعمال الرقمية",
        "logo": {
          "@type": "ImageObject",
          "url": "https://alpha-know.vercel.app/images/logo.png"
        }
      },
      "datePublished": article.date,
      "dateModified": article.date,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://alpha-know.vercel.app/article/${article.id}`
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  // Performance Enhancement: Lazy load images
  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Accessibility Enhancement: Improve keyboard navigation
  enhanceKeyboardNavigation() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'تخطي إلى المحتوى الرئيسي';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Improve focus management
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }



