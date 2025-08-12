// Firebase Database Initialization Script
// سكريبت تهيئة قاعدة بيانات Firebase

class FirebaseInitializer {
  constructor() {
    this.db = window.FIREBASE?.db;
    this.auth = window.FIREBASE?.auth;
  }

  // Check if Firebase is available
  isAvailable() {
    return this.db && this.auth && !window.FIREBASE?.error;
  }

  // Initialize database with sample data
  async initializeDatabase() {
    if (!this.isAvailable()) {
      console.error('❌ Firebase not available for initialization');
      return { success: false, error: 'Firebase not available' };
    }

    try {
      console.log('🔄 Starting Firebase database initialization...');
      
      // Initialize collections with sample data
      await this.initializeCategories();
      await this.initializeArticles();
      await this.initializeUsers();
      await this.initializeSettings();
      
      console.log('✅ Firebase database initialized successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Initialize categories collection
  async initializeCategories() {
    const categories = [
      {
        id: 'entrepreneurship',
        name: 'ريادة الأعمال',
        nameEn: 'Entrepreneurship',
        description: 'مقالات عن ريادة الأعمال والشركات الناشئة',
        descriptionEn: 'Articles about entrepreneurship and startups',
        color: '#3B82F6',
        icon: '🚀',
        count: 0
      },
      {
        id: 'ecommerce',
        name: 'التجارة الإلكترونية',
        nameEn: 'E-commerce',
        description: 'دليل شامل للتجارة الإلكترونية',
        descriptionEn: 'Complete guide to e-commerce',
        color: '#10B981',
        icon: '🛒',
        count: 0
      },
      {
        id: 'marketing',
        name: 'التسويق الرقمي',
        nameEn: 'Digital Marketing',
        description: 'استراتيجيات التسويق الرقمي',
        descriptionEn: 'Digital marketing strategies',
        color: '#F59E0B',
        icon: '📈',
        count: 0
      },
      {
        id: 'technology',
        name: 'التكنولوجيا',
        nameEn: 'Technology',
        description: 'أحدث التطورات التكنولوجية',
        descriptionEn: 'Latest technological developments',
        color: '#8B5CF6',
        icon: '💻',
        count: 0
      },
      {
        id: 'business',
        name: 'إدارة الأعمال',
        nameEn: 'Business Management',
        description: 'مبادئ إدارة الأعمال',
        descriptionEn: 'Business management principles',
        color: '#EF4444',
        icon: '🏢',
        count: 0
      }
    ];

    for (const category of categories) {
      try {
        await this.db.collection('categories').doc(category.id).set({
          ...category,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`✅ Category ${category.name} initialized`);
      } catch (error) {
        console.warn(`⚠️ Failed to initialize category ${category.name}:`, error.message);
      }
    }
  }

  // Initialize articles collection
  async initializeArticles() {
    const articles = [
      {
        title: 'ريادة الأعمال الرقمية: دليل شامل للمبتدئين',
        titleEn: 'Digital Entrepreneurship: Complete Guide for Beginners',
        excerpt: 'تعرف على أساسيات ريادة الأعمال الرقمية وكيفية البدء في مشروعك الأول',
        excerptEn: 'Learn the basics of digital entrepreneurship and how to start your first project',
        content: '<p>محتوى المقال هنا...</p>',
        contentEn: '<p>Article content here...</p>',
        image: '../images/articles/tech-startup.jpg',
        author: 'فريق AlphaKnow',
        authorEn: 'AlphaKnow Team',
        date: '2024-01-15',
        category: 'entrepreneurship',
        status: 'published',
        views: 1250,
        tags: ['ريادة الأعمال', 'الرقمية', 'المبتدئين'],
        tagsEn: ['Entrepreneurship', 'Digital', 'Beginners'],
        slug: 'digital-entrepreneurship-guide'
      },
      {
        title: 'التجارة الإلكترونية: من الصفر إلى الربح',
        titleEn: 'E-commerce: From Zero to Profit',
        excerpt: 'دليل عملي لإنشاء متجر إلكتروني ناجح وتحقيق الأرباح',
        excerptEn: 'Practical guide to creating a successful online store and achieving profits',
        content: '<p>محتوى المقال هنا...</p>',
        contentEn: '<p>Article content here...</p>',
        image: '../images/articles/ecommerce-million-dollar.jpg',
        author: 'فريق AlphaKnow',
        authorEn: 'AlphaKnow Team',
        date: '2024-01-10',
        category: 'ecommerce',
        status: 'published',
        views: 980,
        tags: ['التجارة الإلكترونية', 'المتجر', 'الربح'],
        tagsEn: ['E-commerce', 'Store', 'Profit'],
        slug: 'ecommerce-zero-to-profit'
      },
      {
        title: 'التسويق الرقمي: استراتيجيات فعالة للترويج',
        titleEn: 'Digital Marketing: Effective Promotion Strategies',
        excerpt: 'أفضل استراتيجيات التسويق الرقمي لزيادة مبيعاتك ووصولك للعملاء',
        excerptEn: 'Best digital marketing strategies to increase your sales and reach customers',
        content: '<p>محتوى المقال هنا...</p>',
        contentEn: '<p>Article content here...</p>',
        image: '../images/articles/digital-marketing-growth.jpg',
        author: 'فريق AlphaKnow',
        authorEn: 'AlphaKnow Team',
        date: '2024-01-05',
        category: 'marketing',
        status: 'published',
        views: 1560,
        tags: ['التسويق الرقمي', 'الترويج', 'المبيعات'],
        tagsEn: ['Digital Marketing', 'Promotion', 'Sales'],
        slug: 'digital-marketing-strategies'
      }
    ];

    for (const article of articles) {
      try {
        const docRef = await this.db.collection('articles').add({
          ...article,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`✅ Article "${article.title}" initialized with ID: ${docRef.id}`);
      } catch (error) {
        console.warn(`⚠️ Failed to initialize article "${article.title}":`, error.message);
      }
    }
  }

  // Initialize users collection
  async initializeUsers() {
    const users = [
      {
        email: 'admin@alphaknow.com',
        displayName: 'مدير النظام',
        displayNameEn: 'System Administrator',
        role: 'admin',
        status: 'active',
        avatar: '../images/avatar-admin.jpg',
        bio: 'مدير النظام الرئيسي',
        bioEn: 'Main system administrator',
        permissions: ['read', 'write', 'delete', 'admin']
      }
    ];

    for (const user of users) {
      try {
        await this.db.collection('users').doc(user.email).set({
          ...user,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`✅ User ${user.displayName} initialized`);
      } catch (error) {
        console.warn(`⚠️ Failed to initialize user ${user.displayName}:`, error.message);
      }
    }
  }

  // Initialize settings collection
  async initializeSettings() {
    const settings = {
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

    try {
      await this.db.collection('settings').doc('site').set({
        ...settings,
        updatedAt: new Date()
      });
      console.log('✅ Site settings initialized');
    } catch (error) {
      console.warn('⚠️ Failed to initialize site settings:', error.message);
    }
  }

  // Check if database is empty
  async isDatabaseEmpty() {
    try {
      const articlesSnapshot = await this.db.collection('articles').limit(1).get();
      const categoriesSnapshot = await this.db.collection('categories').limit(1).get();
      
      return articlesSnapshot.empty && categoriesSnapshot.empty;
    } catch (error) {
      console.warn('⚠️ Could not check if database is empty:', error.message);
      return true; // Assume empty if we can't check
    }
  }
}

// Export for use in other modules
window.FirebaseInitializer = FirebaseInitializer;

// Auto-initialize if Firebase is available and database is empty
document.addEventListener('DOMContentLoaded', async () => {
  if (window.FIREBASE && !window.FIREBASE.error) {
    const initializer = new FirebaseInitializer();
    
    if (initializer.isAvailable()) {
      const isEmpty = await initializer.isDatabaseEmpty();
      if (isEmpty) {
        console.log('🔄 Database appears empty, initializing with sample data...');
        await initializer.initializeDatabase();
      }
    }
  }
});
