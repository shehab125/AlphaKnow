// Animation utilities and effects
const ANIMATIONS = {
  // Initialize all animations
  init: () => {
    ANIMATIONS.setupScrollAnimations();
    ANIMATIONS.setupCounterAnimations();
    ANIMATIONS.setupParallaxEffects();
    ANIMATIONS.setupHoverEffects();
  },

  // Scroll-triggered animations
  setupScrollAnimations: () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Trigger counter animation for stats
          if (entry.target.classList.contains('stat-number')) {
            ANIMATIONS.animateCounter(entry.target);
          }
        }
      });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right, .stat-number').forEach(el => {
      observer.observe(el);
    });
  },

  // Counter animation for statistics
  animateCounter: (element) => {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const start = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = UTILS.animation.easeInOut(progress);
      const current = Math.floor(eased * target);
      
      element.textContent = current.toLocaleString('ar-SA');
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target.toLocaleString('ar-SA');
      }
    };
    
    requestAnimationFrame(animate);
  },

  // Parallax effects
  setupParallaxEffects: () => {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    const handleScroll = UTILS.throttle(() => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const rate = scrolled * -0.5;
        element.style.transform = `translateY(${rate}px)`;
      });
    }, 16);
    
    window.addEventListener('scroll', handleScroll);
  },

  // Hover effects
  setupHoverEffects: () => {
    // Card hover effects
    document.querySelectorAll('.article-card, .category-card, .testimonial-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });

    // Button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.05)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
      });
    });
  },

  // Smooth scroll to element
  scrollToElement: (selector, offset = 0) => {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const targetPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    const start = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = UTILS.animation.easeInOut(progress);
      
      window.scrollTo(0, startPosition + distance * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  },

  // Fade in animation
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

  // Fade out animation
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
  },

  // Slide animations
  slideDown: (element, duration = 300) => {
    element.style.height = '0';
    element.style.overflow = 'hidden';
    element.style.display = 'block';
    
    const targetHeight = element.scrollHeight;
    const start = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = UTILS.animation.easeInOut(progress);
      
      element.style.height = (targetHeight * eased) + 'px';
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.style.height = 'auto';
        element.style.overflow = 'visible';
      }
    };
    
    requestAnimationFrame(animate);
  },

  slideUp: (element, duration = 300) => {
    const startHeight = element.offsetHeight;
    element.style.height = startHeight + 'px';
    element.style.overflow = 'hidden';
    
    const start = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = UTILS.animation.easeInOut(progress);
      
      element.style.height = (startHeight * (1 - eased)) + 'px';
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
        element.style.height = 'auto';
        element.style.overflow = 'visible';
      }
    };
    
    requestAnimationFrame(animate);
  },

  // Loading animation
  showLoading: (container) => {
    container.innerHTML = COMPONENTS.createLoadingSpinner();
  },

  // Stagger animation for multiple elements
  staggerAnimation: (elements, delay = 100) => {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-in');
      }, index * delay);
    });
  },

  // Typewriter effect
  typeWriter: (element, text, speed = 50) => {
    element.textContent = '';
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    type();
  }
};

