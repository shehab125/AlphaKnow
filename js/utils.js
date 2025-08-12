// Utility functions for the blog
window.UTILS = window.UTILS || {
  // Performance utilities
  performance: {
    mark: (name) => {
      if (performance && performance.mark) {
        performance.mark(name);
      }
    },
    measure: (name, start, end) => {
      if (performance && performance.measure) {
        performance.measure(name, start, end);
      }
    }
  },

  // DOM utilities
  dom: {
    ready: (callback) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        callback();
      }
    },
    
    createElement: (tag, className, content) => {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (content) element.textContent = content;
      return element;
    },

    fadeIn: (element, duration = 300) => {
      element.style.opacity = '0';
      element.style.display = 'block';
      
      const start = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = progress;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    },

    fadeOut: (element, duration = 300) => {
      const start = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = 1 - progress;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.style.display = 'none';
        }
      };
      
      requestAnimationFrame(animate);
    }
  },

  // String utilities
  string: {
    truncate: (str, length) => {
      return str.length > length ? str.substring(0, length) + '...' : str;
    },
    
    slugify: (str) => {
      return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  },

  // Date utilities
  date: {
    formatArabic: (date) => {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        locale: 'ar-SA'
      };
      return new Date(date).toLocaleDateString('ar-SA', options);
    },
    
    timeAgo: (date) => {
      const now = new Date();
      const past = new Date(date);
      const diffInSeconds = Math.floor((now - past) / 1000);
      
      if (diffInSeconds < 60) return 'منذ لحظات';
      if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
      if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
      if (diffInSeconds < 2592000) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
      return `منذ ${Math.floor(diffInSeconds / 2592000)} شهر`;
    }
  },

  // Storage utilities
  storage: {
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
    },
    
    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn('Failed to read from localStorage:', e);
        return defaultValue;
      }
    },
    
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('Failed to remove from localStorage:', e);
      }
    }
  },

  // Animation utilities
  animation: {
    easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    
    scrollTo: (element, duration = 500) => {
      const start = window.pageYOffset;
      const target = element.offsetTop;
      const distance = target - start;
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = UTILS.animation.easeInOut(progress);
        
        window.scrollTo(0, start + distance * eased);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  },

  // Validation utilities
  validation: {
    email: (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    
    phone: (phone) => {
      const re = /^[\+]?[1-9][\d]{0,15}$/;
      return re.test(phone.replace(/\s/g, ''));
    }
  },

  // Debounce utility
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

  // Throttle utility
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
  }
};

