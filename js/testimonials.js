// Testimonials functionality
const TESTIMONIALS = {
  testimonials: [],
  currentIndex: 0,
  autoSlideInterval: null,

  // Initialize testimonials
  init: () => {
    TESTIMONIALS.loadTestimonials();
    TESTIMONIALS.setupSlider();
    TESTIMONIALS.startAutoSlide();
  },

  // Load testimonials data
  loadTestimonials: () => {
    // Sample testimonials data
    TESTIMONIALS.testimonials = [
      {
        id: 1,
        name: 'أحمد محمد',
        title: 'مؤسس متجر تك شوب',
        text: 'بفضل المحتوى الاستثنائي في هذه المدونة، تمكنت من زيادة أرباح متجري الإلكتروني بنسبة 300% في أقل من 6 أشهر. الاستراتيجيات عملية ومجربة.',
        rating: 5,
        avatar: 'images/testimonials/ahmed.jpg'
      },
      {
        id: 2,
        name: 'فاطمة أحمد',
        title: 'مصممة جرافيك مستقلة',
        text: 'كمستقلة، ساعدتني المقالات هنا على تطوير مهاراتي وزيادة أسعاري. الآن أحقق دخلاً شهرياً يفوق 5000 دولار من العمل الحر.',
        rating: 5,
        avatar: 'images/testimonials/fatima.jpg'
      },
      {
        id: 3,
        name: 'محمد علي',
        title: 'مؤسس تطبيق إدارة المشاريع',
        text: 'المحتوى هنا ليس مجرد نظريات، بل خبرات حقيقية وعملية. تمكنت من إطلاق شركتي الناشئة وجمع التمويل الأولي بنجاح.',
        rating: 5,
        avatar: 'images/testimonials/mohammed.jpg'
      },
      {
        id: 4,
        name: 'سارة خالد',
        title: 'مديرة تسويق رقمي',
        text: 'الاستراتيجيات التسويقية المشاركة هنا ساعدتني في تحسين حملاتي الإعلانية وزيادة معدل التحويل بنسبة 250%.',
        rating: 5,
        avatar: 'images/testimonials/sara.jpg'
      },
      {
        id: 5,
        name: 'عبدالله حسن',
        title: 'مستثمر في العملات الرقمية',
        text: 'دليل الاستثمار في العملات الرقمية كان نقطة تحول في مسيرتي الاستثمارية. حققت أرباحاً تفوق 400% في عام واحد.',
        rating: 5,
        avatar: 'images/testimonials/abdullah.jpg'
      }
    ];
  },

  // Setup testimonials slider
  setupSlider: () => {
    const container = document.getElementById('testimonials-slider');
    if (!container) return;

    TESTIMONIALS.renderTestimonials();
    TESTIMONIALS.setupNavigation();
    TESTIMONIALS.setupTouchEvents();
  },

  // Render testimonials
  renderTestimonials: () => {
    const container = document.getElementById('testimonials-slider');
    if (!container) return;

    const testimonialsHTML = TESTIMONIALS.testimonials.map((testimonial, index) => `
      <div class="testimonial-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
        ${COMPONENTS.createTestimonial(testimonial)}
      </div>
    `).join('');

    container.innerHTML = `
      <div class="testimonials-track">
        ${testimonialsHTML}
      </div>
      <div class="testimonials-navigation">
        <button class="testimonial-nav prev" onclick="TESTIMONIALS.previousSlide()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>
        <div class="testimonials-dots">
          ${TESTIMONIALS.testimonials.map((_, index) => 
            `<button class="testimonial-dot ${index === 0 ? 'active' : ''}" onclick="TESTIMONIALS.goToSlide(${index})"></button>`
          ).join('')}
        </div>
        <button class="testimonial-nav next" onclick="TESTIMONIALS.nextSlide()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>
    `;
  },

  // Setup navigation
  setupNavigation: () => {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        TESTIMONIALS.nextSlide();
      } else if (e.key === 'ArrowRight') {
        TESTIMONIALS.previousSlide();
      }
    });
  },

  // Setup touch events for mobile
  setupTouchEvents: () => {
    const container = document.getElementById('testimonials-slider');
    if (!container) return;

    let startX = 0;
    let endX = 0;

    container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    container.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          TESTIMONIALS.nextSlide();
        } else {
          TESTIMONIALS.previousSlide();
        }
      }
    });
  },

  // Go to specific slide
  goToSlide: (index) => {
    if (index < 0 || index >= TESTIMONIALS.testimonials.length) return;

    TESTIMONIALS.currentIndex = index;
    TESTIMONIALS.updateSlider();
    TESTIMONIALS.restartAutoSlide();
  },

  // Next slide
  nextSlide: () => {
    TESTIMONIALS.currentIndex = (TESTIMONIALS.currentIndex + 1) % TESTIMONIALS.testimonials.length;
    TESTIMONIALS.updateSlider();
    TESTIMONIALS.restartAutoSlide();
  },

  // Previous slide
  previousSlide: () => {
    TESTIMONIALS.currentIndex = TESTIMONIALS.currentIndex === 0 
      ? TESTIMONIALS.testimonials.length - 1 
      : TESTIMONIALS.currentIndex - 1;
    TESTIMONIALS.updateSlider();
    TESTIMONIALS.restartAutoSlide();
  },

  // Update slider display
  updateSlider: () => {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');

    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === TESTIMONIALS.currentIndex);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === TESTIMONIALS.currentIndex);
    });

    // Update track position
    const track = document.querySelector('.testimonials-track');
    if (track) {
      track.style.transform = `translateX(-${TESTIMONIALS.currentIndex * 100}%)`;
    }
  },

  // Start auto slide
  startAutoSlide: () => {
    TESTIMONIALS.autoSlideInterval = setInterval(() => {
      TESTIMONIALS.nextSlide();
    }, 5000);
  },

  // Stop auto slide
  stopAutoSlide: () => {
    if (TESTIMONIALS.autoSlideInterval) {
      clearInterval(TESTIMONIALS.autoSlideInterval);
      TESTIMONIALS.autoSlideInterval = null;
    }
  },

  // Restart auto slide
  restartAutoSlide: () => {
    TESTIMONIALS.stopAutoSlide();
    TESTIMONIALS.startAutoSlide();
  },

  // Pause auto slide on hover
  setupHoverPause: () => {
    const container = document.getElementById('testimonials-slider');
    if (!container) return;

    container.addEventListener('mouseenter', TESTIMONIALS.stopAutoSlide);
    container.addEventListener('mouseleave', TESTIMONIALS.startAutoSlide);
  },

  // Add new testimonial (for admin functionality)
  addTestimonial: (testimonial) => {
    TESTIMONIALS.testimonials.push({
      ...testimonial,
      id: Date.now(),
      rating: testimonial.rating || 5
    });
    
    TESTIMONIALS.renderTestimonials();
    TESTIMONIALS.saveTestimonials();
  },

  // Save testimonials to localStorage
  saveTestimonials: () => {
    UTILS.storage.set('testimonials', TESTIMONIALS.testimonials);
  },

  // Load testimonials from localStorage
  loadFromStorage: () => {
    const saved = UTILS.storage.get('testimonials');
    if (saved && saved.length > 0) {
      TESTIMONIALS.testimonials = saved;
    }
  },

  // Get testimonial statistics
  getStats: () => {
    const totalTestimonials = TESTIMONIALS.testimonials.length;
    const averageRating = TESTIMONIALS.testimonials.reduce((sum, t) => sum + t.rating, 0) / totalTestimonials;
    const ratingDistribution = {};
    
    TESTIMONIALS.testimonials.forEach(t => {
      ratingDistribution[t.rating] = (ratingDistribution[t.rating] || 0) + 1;
    });

    return {
      total: totalTestimonials,
      averageRating: Math.round(averageRating * 10) / 10,
      distribution: ratingDistribution
    };
  },

  // Filter testimonials by rating
  filterByRating: (minRating) => {
    return TESTIMONIALS.testimonials.filter(t => t.rating >= minRating);
  },

  // Search testimonials
  searchTestimonials: (query) => {
    const searchTerm = query.toLowerCase();
    return TESTIMONIALS.testimonials.filter(t => 
      t.name.toLowerCase().includes(searchTerm) ||
      t.title.toLowerCase().includes(searchTerm) ||
      t.text.toLowerCase().includes(searchTerm)
    );
  },

  // Show testimonial submission form
  showSubmissionForm: () => {
    const content = `
      <form id="testimonial-form" class="testimonial-form">
        <div class="form-group">
          <label for="testimonial-name">الاسم</label>
          <input type="text" id="testimonial-name" required>
        </div>
        <div class="form-group">
          <label for="testimonial-title">المسمى الوظيفي</label>
          <input type="text" id="testimonial-title" required>
        </div>
        <div class="form-group">
          <label for="testimonial-text">التقييم</label>
          <textarea id="testimonial-text" rows="4" required></textarea>
        </div>
        <div class="form-group">
          <label>التقييم</label>
          <div class="rating-input">
            ${[1,2,3,4,5].map(i => 
              `<button type="button" class="star-btn" data-rating="${i}">★</button>`
            ).join('')}
          </div>
        </div>
      </form>
    `;

    const actions = [
      {
        text: 'إرسال التقييم',
        class: 'btn-primary',
        onclick: 'TESTIMONIALS.submitTestimonial()'
      },
      {
        text: 'إلغاء',
        class: 'btn-secondary',
        onclick: 'COMPONENTS.closeModal()'
      }
    ];

    COMPONENTS.showModal('شارك تجربتك', content, actions);
    TESTIMONIALS.setupRatingInput();
  },

  // Setup rating input
  setupRatingInput: () => {
    const stars = document.querySelectorAll('.star-btn');
    let selectedRating = 5;

    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        selectedRating = index + 1;
        stars.forEach((s, i) => {
          s.classList.toggle('active', i < selectedRating);
        });
      });
    });

    // Set default rating
    stars.forEach((s, i) => s.classList.toggle('active', i < 5));
  },

  // Submit testimonial
  submitTestimonial: () => {
    const form = document.getElementById('testimonial-form');
    if (!form) return;

    const name = form.querySelector('#testimonial-name').value.trim();
    const title = form.querySelector('#testimonial-title').value.trim();
    const text = form.querySelector('#testimonial-text').value.trim();
    const rating = document.querySelectorAll('.star-btn.active').length;

    if (!name || !title || !text) {
      COMPONENTS.showToast('يرجى ملء جميع الحقول', 'error');
      return;
    }

    const testimonial = {
      name,
      title,
      text,
      rating,
      avatar: 'images/testimonials/default.jpg',
      date: new Date().toISOString()
    };

    TESTIMONIALS.addTestimonial(testimonial);
    COMPONENTS.closeModal();
    COMPONENTS.showToast('شكراً لك! تم إرسال تقييمك بنجاح', 'success');
  }
};

