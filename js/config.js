// Configuration and Constants
const CONFIG = {
  // Site Information
  site: {
    name: 'ريادة الأعمال الرقمية',
    description: 'المدونة الرائدة في الوطن العربي لريادة الأعمال الرقمية والربح من الإنترنت',
    url: 'https://digital-entrepreneurship.com',
    author: 'فريق ريادة الأعمال الرقمية',
    language: 'ar',
    direction: 'rtl'
  },

  // API Endpoints
  api: {
    articles: 'data/articles.json',
    categories: 'data/categories.json',
    newsletter: 'api/newsletter.php',
    search: 'api/search.php',
    contact: 'api/contact.php'
  },

  // Animation Settings
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500
    },
    easing: 'ease-in-out',
    observerOptions: {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  },

  // Pagination
  pagination: {
    articlesPerPage: 9,
    searchResultsPerPage: 6
  },

  // Search Settings
  search: {
    minQueryLength: 2,
    debounceDelay: 300,
    maxSuggestions: 5
  },

  // Newsletter
  newsletter: {
    successMessage: 'تم الاشتراك بنجاح! شكراً لانضمامك إلينا.',
    errorMessage: 'حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى.',
    validationMessages: {
      name: 'يرجى إدخال اسم صحيح',
      email: 'يرجى إدخال بريد إلكتروني صحيح',
      interest: 'يرجى اختيار مجال الاهتمام'
    }
  },

  // Social Media
  social: {
    facebook: 'https://facebook.com/digital-entrepreneurship',
    twitter: 'https://twitter.com/digital_ent_ar',
    linkedin: 'https://linkedin.com/company/digital-entrepreneurship',
    youtube: 'https://youtube.com/c/digital-entrepreneurship',
    instagram: 'https://instagram.com/digital.entrepreneurship'
  },

  // Categories
  categories: {
    entrepreneurship: {
      name: 'ريادة الأعمال',
      color: '#1a365d',
      icon: 'layers'
    },
    ecommerce: {
      name: 'التجارة الإلكترونية',
      color: '#3182ce',
      icon: 'shopping-cart'
    },
    marketing: {
      name: 'التسويق الرقمي',
      color: '#38a169',
      icon: 'megaphone'
    },
    freelancing: {
      name: 'العمل الحر',
      color: '#d69e2e',
      icon: 'briefcase'
    },
    investment: {
      name: 'الاستثمار الرقمي',
      color: '#e53e3e',
      icon: 'trending-up'
    },
    tools: {
      name: 'الأدوات والموارد',
      color: '#805ad5',
      icon: 'tool'
    }
  },

  // Theme Settings
  theme: {
    default: 'light',
    storageKey: 'theme-preference',
    systemPreference: true
  },

  // Performance Settings
  performance: {
    lazyLoadOffset: 100,
    imageQuality: 85,
    enableServiceWorker: true,
    cacheVersion: 'v1.0.0'
  },

  // Analytics
  analytics: {
    gtag: 'GA_MEASUREMENT_ID',
    fbPixel: 'FB_PIXEL_ID',
    enabled: false // Set to true in production
  },

  // Contact Information
  contact: {
    email: 'info@digital-entrepreneurship.com',
    phone: '+966 50 123 4567',
    address: 'الرياض، المملكة العربية السعودية',
    workingHours: 'الأحد - الخميس: 9:00 ص - 6:00 م'
  },

  // SEO Settings
  seo: {
    defaultTitle: 'ريادة الأعمال الرقمية - المدونة الرائدة في الوطن العربي',
    titleSeparator: ' | ',
    defaultDescription: 'اكتشف أسرار النجاح في العالم الرقمي مع محتوى حصري واستراتيجيات مجربة لتحقيق الاستقلال المالي والنجاح في ريادة الأعمال عبر الإنترنت.',
    defaultKeywords: 'ريادة الأعمال, الربح من الإنترنت, التجارة الإلكترونية, التسويق الرقمي, العمل الحر, الاستثمار الرقمي',
    ogImage: 'images/og-image.jpg',
    twitterCard: 'summary_large_image'
  },

  // Error Messages
  errors: {
    network: 'خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.',
    server: 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
    notFound: 'المحتوى المطلوب غير موجود.',
    validation: 'يرجى التحقق من البيانات المدخلة.',
    generic: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
  },

  // Loading Messages
  loading: {
    articles: 'جاري تحميل المقالات...',
    search: 'جاري البحث...',
    newsletter: 'جاري الاشتراك...',
    contact: 'جاري إرسال الرسالة...',
    generic: 'جاري التحميل...'
  },

  // Success Messages
  success: {
    newsletter: 'تم الاشتراك بنجاح! ستصلك رسالة تأكيد قريباً.',
    contact: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.',
    share: 'تم نسخ الرابط بنجاح!',
    bookmark: 'تم حفظ المقال في المفضلة!'
  },

  // Feature Flags
  features: {
    darkMode: true,
    search: true,
    newsletter: true,
    comments: false,
    sharing: true,
    bookmarks: true,
    notifications: false,
    offline: true
  },

  // Breakpoints (matching CSS)
  breakpoints: {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1400
  },

  // Local Storage Keys
  storage: {
    theme: 'digital-ent-theme',
    bookmarks: 'digital-ent-bookmarks',
    preferences: 'digital-ent-preferences',
    searchHistory: 'digital-ent-search-history',
    visitCount: 'digital-ent-visit-count',
    lastVisit: 'digital-ent-last-visit'
  },

  // Date Formatting
  dateFormat: {
    locale: 'ar-SA',
    options: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    relative: true
  },

  // Validation Rules
  validation: {
    name: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+$/
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
      pattern: /^(\+966|0)?[5-9]\d{8}$/
    }
  },

  // Cache Settings
  cache: {
    articles: 5 * 60 * 1000, // 5 minutes
    search: 2 * 60 * 1000,   // 2 minutes
    images: 24 * 60 * 60 * 1000, // 24 hours
    static: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
};

// Utility Functions
const UTILS = {
  // Get current timestamp
  now: () => Date.now(),

  // Generate unique ID
  generateId: () => Math.random().toString(36).substr(2, 9),

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Format date in Arabic
  formatDate: (date, options = CONFIG.dateFormat.options) => {
    return new Intl.DateTimeFormat(CONFIG.dateFormat.locale, options).format(new Date(date));
  },

  // Get relative time
  getRelativeTime: (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'منذ لحظات';
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    if (diffInSeconds < 2592000) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
    if (diffInSeconds < 31536000) return `منذ ${Math.floor(diffInSeconds / 2592000)} شهر`;
    return `منذ ${Math.floor(diffInSeconds / 31536000)} سنة`;
  },

  // Validate email
  isValidEmail: (email) => CONFIG.validation.email.pattern.test(email),

  // Validate Arabic name
  isValidName: (name) => {
    return name.length >= CONFIG.validation.name.minLength &&
           name.length <= CONFIG.validation.name.maxLength &&
           CONFIG.validation.name.pattern.test(name);
  },

  // Get device type
  getDeviceType: () => {
    const width = window.innerWidth;
    if (width < CONFIG.breakpoints.sm) return 'mobile';
    if (width < CONFIG.breakpoints.lg) return 'tablet';
    return 'desktop';
  },

  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Local storage helpers
  storage: {
    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    }
  },

  // URL helpers
  url: {
    getParams: () => new URLSearchParams(window.location.search),
    setParam: (key, value) => {
      const url = new URL(window.location);
      url.searchParams.set(key, value);
      window.history.pushState({}, '', url);
    },
    removeParam: (key) => {
      const url = new URL(window.location);
      url.searchParams.delete(key);
      window.history.pushState({}, '', url);
    }
  },

  // Performance helpers
  performance: {
    mark: (name) => {
      if (performance.mark) {
        performance.mark(name);
      }
    },
    measure: (name, startMark, endMark) => {
      if (performance.measure) {
        performance.measure(name, startMark, endMark);
      }
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, UTILS };
}

