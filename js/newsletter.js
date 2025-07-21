// Newsletter subscription functionality
const NEWSLETTER = {
  // Initialize newsletter
  init: () => {
    NEWSLETTER.setupForm();
    NEWSLETTER.setupValidation();
  },

  // Setup newsletter form
  setupForm: () => {
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');
    const submitButton = document.getElementById('newsletter-submit');
    
    if (!form || !emailInput || !submitButton) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      NEWSLETTER.handleSubmission(emailInput.value.trim());
    });
    
    // Real-time validation
    emailInput.addEventListener('input', () => {
      NEWSLETTER.validateEmail(emailInput.value.trim());
    });
  },

  // Setup form validation
  setupValidation: () => {
    const emailInput = document.getElementById('newsletter-email');
    if (!emailInput) return;
    
    emailInput.addEventListener('blur', () => {
      const email = emailInput.value.trim();
      if (email && !UTILS.validation.email(email)) {
        NEWSLETTER.showError('يرجى إدخال بريد إلكتروني صحيح');
      }
    });
  },

  // Validate email
  validateEmail: (email) => {
    const emailInput = document.getElementById('newsletter-email');
    const errorElement = document.querySelector('.newsletter-error');
    
    if (!email) {
      NEWSLETTER.clearError();
      return false;
    }
    
    if (!UTILS.validation.email(email)) {
      NEWSLETTER.showError('يرجى إدخال بريد إلكتروني صحيح');
      emailInput.classList.add('error');
      return false;
    }
    
    NEWSLETTER.clearError();
    emailInput.classList.remove('error');
    return true;
  },

  // Handle form submission
  handleSubmission: async (email) => {
    if (!NEWSLETTER.validateEmail(email)) {
      return;
    }
    
    // Check if already subscribed
    if (NEWSLETTER.isAlreadySubscribed(email)) {
      NEWSLETTER.showError('هذا البريد الإلكتروني مشترك بالفعل');
      return;
    }
    
    NEWSLETTER.setLoading(true);
    
    try {
      // Simulate API call
      await NEWSLETTER.subscribeUser(email);
      NEWSLETTER.handleSuccess(email);
    } catch (error) {
      NEWSLETTER.handleError(error.message);
    } finally {
      NEWSLETTER.setLoading(false);
    }
  },

  // Subscribe user (simulate API call)
  subscribeUser: async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) {
          resolve({ success: true, message: 'تم الاشتراك بنجاح' });
        } else {
          reject(new Error('حدث خطأ في الخادم، يرجى المحاولة لاحقاً'));
        }
      }, 1500);
    });
  },

  // Check if email is already subscribed
  isAlreadySubscribed: (email) => {
    const subscribers = UTILS.storage.get('newsletter_subscribers', []);
    return subscribers.includes(email.toLowerCase());
  },

  // Handle successful subscription
  handleSuccess: (email) => {
    // Store subscription locally
    const subscribers = UTILS.storage.get('newsletter_subscribers', []);
    subscribers.push(email.toLowerCase());
    UTILS.storage.set('newsletter_subscribers', subscribers);
    
    // Show success message
    NEWSLETTER.showSuccess('تم الاشتراك بنجاح! ستصلك أحدث المقالات في بريدك الإلكتروني');
    
    // Clear form
    const form = document.getElementById('newsletter-form');
    if (form) form.reset();
    
    // Track subscription
    NEWSLETTER.trackSubscription(email);
    
    // Show welcome modal after delay
    setTimeout(() => {
      NEWSLETTER.showWelcomeModal();
    }, 2000);
  },

  // Handle subscription error
  handleError: (message) => {
    NEWSLETTER.showError(message || 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً');
  },

  // Set loading state
  setLoading: (loading) => {
    const submitButton = document.getElementById('newsletter-submit');
    const emailInput = document.getElementById('newsletter-email');
    
    if (!submitButton) return;
    
    if (loading) {
      submitButton.disabled = true;
      submitButton.innerHTML = 'جاري الاشتراك...';
      if (emailInput) emailInput.disabled = true;
    } else {
      submitButton.disabled = false;
      submitButton.innerHTML = 'اشترك مجاناً الآن';
      if (emailInput) emailInput.disabled = false;
    }
  },

  // Show error message
  showError: (message) => {
    NEWSLETTER.clearMessages();
    
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'newsletter-error';
    errorDiv.textContent = message;
    
    form.appendChild(errorDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      NEWSLETTER.clearError();
    }, 5000);
  },

  // Show success message
  showSuccess: (message) => {
    NEWSLETTER.clearMessages();
    
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    
    const successDiv = document.createElement('div');
    successDiv.className = 'newsletter-success';
    successDiv.textContent = message;
    
    form.appendChild(successDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      NEWSLETTER.clearSuccess();
    }, 5000);
  },

  // Clear error message
  clearError: () => {
    const errorElement = document.querySelector('.newsletter-error');
    if (errorElement) {
      errorElement.remove();
    }
  },

  // Clear success message
  clearSuccess: () => {
    const successElement = document.querySelector('.newsletter-success');
    if (successElement) {
      successElement.remove();
    }
  },

  // Clear all messages
  clearMessages: () => {
    NEWSLETTER.clearError();
    NEWSLETTER.clearSuccess();
  },

  // Track subscription for analytics
  trackSubscription: (email) => {
    const subscriptionData = {
      email: email.toLowerCase(),
      timestamp: new Date().toISOString(),
      source: 'homepage',
      userAgent: navigator.userAgent
    };
    
    // Store subscription data
    const subscriptions = UTILS.storage.get('newsletter_analytics', []);
    subscriptions.push(subscriptionData);
    UTILS.storage.set('newsletter_analytics', subscriptions);
    
    console.log('Newsletter subscription tracked:', subscriptionData);
  },

  // Show welcome modal
  showWelcomeModal: () => {
    const content = `
      <div class="welcome-content">
        <div class="welcome-icon">🎉</div>
        <h3>مرحباً بك في مجتمعنا!</h3>
        <p>شكراً لانضمامك إلى أكثر من 50,000 رائد أعمال يتلقون محتوى حصري أسبوعياً</p>
        <div class="welcome-benefits">
          <div class="benefit">
            <span class="benefit-icon">📚</span>
            <span>محتوى حصري غير منشور</span>
          </div>
          <div class="benefit">
            <span class="benefit-icon">💡</span>
            <span>استراتيجيات مجربة ومختبرة</span>
          </div>
          <div class="benefit">
            <span class="benefit-icon">🚀</span>
            <span>فرص استثمارية وشراكات</span>
          </div>
        </div>
        <p class="welcome-note">ستصلك أول نشرة خلال 24 ساعة</p>
      </div>
    `;
    
    const actions = [
      {
        text: 'ممتاز!',
        class: 'btn-primary',
        onclick: 'COMPONENTS.closeModal()'
      }
    ];
    
    COMPONENTS.showModal('مرحباً بك!', content, actions);
  },

  // Get subscription statistics
  getStats: () => {
    const subscribers = UTILS.storage.get('newsletter_subscribers', []);
    const analytics = UTILS.storage.get('newsletter_analytics', []);
    
    return {
      totalSubscribers: subscribers.length,
      subscriptionsToday: analytics.filter(sub => {
        const today = new Date().toDateString();
        return new Date(sub.timestamp).toDateString() === today;
      }).length,
      subscriptionsThisWeek: analytics.filter(sub => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(sub.timestamp) > weekAgo;
      }).length
    };
  },

  // Setup exit-intent popup
  setupExitIntent: () => {
    let hasShown = false;
    
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !hasShown) {
        hasShown = true;
        NEWSLETTER.showExitIntentPopup();
      }
    });
  },

  // Show exit-intent popup
  showExitIntentPopup: () => {
    const content = `
      <div class="exit-intent-content">
        <h3>انتظر! لا تفوت الفرصة</h3>
        <p>احصل على دليل مجاني "10 استراتيجيات لزيادة أرباحك من الإنترنت" عند اشتراكك في نشرتنا</p>
        <form id="exit-intent-form" class="exit-intent-form">
          <input type="email" placeholder="أدخل بريدك الإلكتروني" required>
          <button type="submit" class="btn btn-primary">احصل على الدليل مجاناً</button>
        </form>
        <p class="exit-intent-note">لن نرسل لك رسائل مزعجة، وعد!</p>
      </div>
    `;
    
    COMPONENTS.showModal('عرض خاص', content);
    
    // Setup exit-intent form
    const exitForm = document.getElementById('exit-intent-form');
    if (exitForm) {
      exitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = exitForm.querySelector('input[type="email"]').value;
        NEWSLETTER.handleSubmission(email);
        COMPONENTS.closeModal();
      });
    }
  }
};

