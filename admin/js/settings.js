// Admin Settings Management
// إدارة إعدادات لوحة الإدارة

class AdminSettings {
  constructor() {
    this.settings = {};
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.bindEvents();
  }

  async loadSettings() {
    try {
      // Try to load from Firebase first
      if (window.FIREBASE && !window.FIREBASE.error) {
        const settingsDoc = await window.FIREBASE.db.collection('settings').doc('site').get();
        if (settingsDoc.exists) {
          this.settings = settingsDoc.data();
          console.log('✅ Settings loaded from Firebase');
        } else {
          this.settings = this.getDefaultSettings();
          console.log('⚠️ No settings found in Firebase, using defaults');
        }
      } else {
        this.settings = this.getDefaultSettings();
        console.log('⚠️ Firebase not available, using default settings');
      }
    } catch (error) {
      console.error('❌ Error loading settings:', error);
      this.settings = this.getDefaultSettings();
    }

    this.populateSettingsForm();
  }

  getDefaultSettings() {
    return {
      siteName: 'AlphaKnow',
      siteNameAr: 'ألفا ناو',
      siteDescription: 'منصة المعرفة الرقمية',
      siteDescriptionEn: 'Digital Knowledge Platform',
      logo: '../images/logo.png',
      favicon: '../assets/favicon.ico',
      theme: 'light',
      language: 'ar',
      analytics: {
        googleAnalytics: '',
        facebookPixel: ''
      },
      social: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
      },
      contact: {
        email: 'info@alphaknow.com',
        phone: '',
        address: ''
      }
    };
  }

  populateSettingsForm() {
    // General settings
    const siteTitle = document.getElementById('site-title');
    const siteDescription = document.getElementById('site-description');
    
    if (siteTitle) siteTitle.value = this.settings.siteName || '';
    if (siteDescription) siteDescription.value = this.settings.siteDescription || '';

    // SEO settings
    const googleAnalytics = document.getElementById('google-analytics');
    if (googleAnalytics) googleAnalytics.value = this.settings.analytics?.googleAnalytics || '';
  }

  async saveSettings(formData) {
    try {
      const updatedSettings = {
        ...this.settings,
        ...formData,
        updatedAt: new Date()
      };

      // Save to Firebase if available
      if (window.FIREBASE && !window.FIREBASE.error) {
        await window.FIREBASE.db.collection('settings').doc('site').set(updatedSettings);
        console.log('✅ Settings saved to Firebase');
      }

      // Update local settings
      this.settings = updatedSettings;

      // Save to localStorage as backup
      localStorage.setItem('alphaknow_settings', JSON.stringify(updatedSettings));

      return { success: true };
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      return { success: false, error: error.message };
    }
  }

  bindEvents() {
    // General settings form
    const generalForm = document.getElementById('general-settings-form');
    if (generalForm) {
      generalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleGeneralSettingsSubmit(e.target);
      });
    }

    // SEO settings form
    const seoForm = document.getElementById('seo-settings-form');
    if (seoForm) {
      seoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleSEOSettingsSubmit(e.target);
      });
    }
  }

  async handleGeneralSettingsSubmit(form) {
    const formData = new FormData(form);
    const settings = {
      siteName: formData.get('siteTitle'),
      siteDescription: formData.get('siteDescription')
    };

    const result = await this.saveSettings(settings);
    if (result.success) {
      this.showSuccess('تم حفظ الإعدادات العامة بنجاح');
    } else {
      this.showError('فشل في حفظ الإعدادات: ' + result.error);
    }
  }

  async handleSEOSettingsSubmit(form) {
    const formData = new FormData(form);
    const settings = {
      analytics: {
        ...this.settings.analytics,
        googleAnalytics: formData.get('googleAnalytics')
      }
    };

    const result = await this.saveSettings(settings);
    if (result.success) {
      this.showSuccess('تم حفظ إعدادات SEO بنجاح');
    } else {
      this.showError('فشل في حفظ إعدادات SEO: ' + result.error);
    }
  }

  showSuccess(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'admin-notification admin-notification-success';
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
      <button class="admin-notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  showError(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'admin-notification admin-notification-error';
    notification.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
      <button class="admin-notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.adminSettings = new AdminSettings();
});
