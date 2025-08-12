// Firebase Service Class
class FirebaseService {
  constructor() {
    // Check if Firebase is available
    if (!window.FIREBASE || window.FIREBASE.error) {
      console.warn('⚠️ Firebase not available, using fallback mode');
      this.isAvailable = false;
      this.error = window.FIREBASE?.error || 'Firebase not initialized';
    } else {
      this.auth = FIREBASE.auth;
      this.db = FIREBASE.db;
      this.storage = FIREBASE.storage;
      this.isAvailable = true;
      this.error = null;
    }
  }

  // Check if Firebase is available
  isFirebaseAvailable() {
    return this.isAvailable && this.db && this.auth;
  }

  // Authentication Methods
  async signIn(email, password) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Firebase sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  async signUp(email, password, displayName) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({ displayName });
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Firebase sign up error:', error);
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      await this.auth.signOut();
      return { success: true };
    } catch (error) {
      console.error('Firebase sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  getCurrentUser() {
    if (!this.isFirebaseAvailable()) {
      return null;
    }
    return this.auth.currentUser;
  }

  onAuthStateChanged(callback) {
    if (!this.isFirebaseAvailable()) {
      return () => {}; // Return empty unsubscribe function
    }
    return this.auth.onAuthStateChanged(callback);
  }

  // Articles Methods
  async getArticles() {
    if (!this.isFirebaseAvailable()) {
      console.warn('Firebase not available, returning empty articles array');
      return { success: true, data: [] };
    }

    try {
      const snapshot = await this.db.collection('articles')
        .orderBy('createdAt', 'desc')
        .get();
      
      const articles = [];
      snapshot.forEach(doc => {
        articles.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: articles };
    } catch (error) {
      console.error('Firebase getArticles error:', error);
      return { success: false, error: error.message };
    }
  }

  async getArticle(id) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      const doc = await this.db.collection('articles').doc(id).get();
      if (doc.exists) {
        return { success: true, data: { id: doc.id, ...doc.data() } };
      } else {
        return { success: false, error: 'Article not found' };
      }
    } catch (error) {
      console.error('Firebase getArticle error:', error);
      return { success: false, error: error.message };
    }
  }

  async createArticle(articleData) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    // Check if user is authenticated
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const article = {
        ...articleData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        authorId: currentUser.uid,
        authorEmail: currentUser.email,
        authorName: currentUser.displayName || currentUser.email,
        views: 0,
        likes: 0
      };

      console.log('🔄 Creating article in Firestore:', article);
      const docRef = await this.db.collection('articles').add(article);
      console.log('✅ Article created successfully with ID:', docRef.id);
      
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('❌ Firebase createArticle error:', error);
      
      // Provide specific error messages based on error codes
      let errorMessage = error.message;
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied - check Firestore security rules';
      } else if (error.code === 'unauthenticated') {
        errorMessage = 'Authentication required - please sign in again';
      } else if (error.code === 'invalid-argument') {
        errorMessage = 'Invalid data format - check article data';
      } else if (error.code === 'resource-exhausted') {
        errorMessage = 'Firestore quota exceeded - try again later';
      }
      
      return { success: false, error: errorMessage, code: error.code };
    }
  }

  async updateArticle(id, articleData) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    // Check if user is authenticated
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const article = {
        ...articleData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastModifiedBy: currentUser.uid,
        lastModifiedAt: new Date().toISOString()
      };

      console.log('🔄 Updating article in Firestore:', { id, article });
      await this.db.collection('articles').doc(id).update(article);
      console.log('✅ Article updated successfully');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Firebase updateArticle error:', error);
      
      // Provide specific error messages based on error codes
      let errorMessage = error.message;
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied - check Firestore security rules';
      } else if (error.code === 'unauthenticated') {
        errorMessage = 'Authentication required - please sign in again';
      } else if (error.code === 'not-found') {
        errorMessage = 'Article not found - it may have been deleted';
      } else if (error.code === 'invalid-argument') {
        errorMessage = 'Invalid data format - check article data';
      }
      
      return { success: false, error: errorMessage, code: error.code };
    }
  }

  async deleteArticle(id) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      await this.db.collection('articles').doc(id).delete();
      return { success: true };
    } catch (error) {
      console.error('Firebase deleteArticle error:', error);
      return { success: false, error: error.message };
    }
  }

  async incrementArticleViews(id) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      await this.db.collection('articles').doc(id).update({
        views: firebase.firestore.FieldValue.increment(1)
      });
      return { success: true };
    } catch (error) {
      console.error('Firebase incrementArticleViews error:', error);
      return { success: false, error: error.message };
    }
  }

  // Categories Methods
  async getCategories() {
    if (!this.isFirebaseAvailable()) {
      console.warn('Firebase not available, returning empty categories array');
      return { success: true, data: [] };
    }

    try {
      const snapshot = await this.db.collection('categories')
        .orderBy('name')
        .get();
      
      const categories = [];
      snapshot.forEach(doc => {
        categories.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: categories };
    } catch (error) {
      console.error('Firebase getCategories error:', error);
      return { success: false, error: error.message };
    }
  }

  async createCategory(categoryData) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      const category = {
        ...categoryData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        articleCount: 0
      };

      const docRef = await this.db.collection('categories').add(category);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Firebase createCategory error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateCategory(id, categoryData) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      const category = {
        ...categoryData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection('categories').doc(id).update(category);
      return { success: true };
    } catch (error) {
      console.error('Firebase updateCategory error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteCategory(id) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      await this.db.collection('categories').doc(id).delete();
      return { success: true };
    } catch (error) {
      console.error('Firebase deleteCategory error:', error);
      return { success: false, error: error.message };
    }
  }

  // Users Methods
  async getUsers() {
    if (!this.isFirebaseAvailable()) {
      console.warn('Firebase not available, returning empty users array');
      return { success: true, data: [] };
    }

    try {
      const snapshot = await this.db.collection('users')
        .orderBy('displayName')
        .get();
      
      const users = [];
      snapshot.forEach(doc => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: users };
    } catch (error) {
      console.error('Firebase getUsers error:', error);
      return { success: false, error: error.message };
    }
  }

  async createUser(userData) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      const user = {
        ...userData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
        isActive: true
      };

      const docRef = await this.db.collection('users').add(user);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Firebase createUser error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUser(id, userData) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      const user = {
        ...userData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection('users').doc(id).update(user);
      return { success: true };
    } catch (error) {
      console.error('Firebase updateUser error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteUser(id) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      await this.db.collection('users').doc(id).delete();
      return { success: true };
    } catch (error) {
      console.error('Firebase deleteUser error:', error);
      return { success: false, error: error.message };
    }
  }

  // Media Methods
  async uploadMedia(file, path) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      const storageRef = this.storage.ref();
      const fileRef = storageRef.child(path);
      const snapshot = await fileRef.put(file);
      const downloadURL = await snapshot.ref.getDownloadURL();
      
      return { success: true, url: downloadURL };
    } catch (error) {
      console.error('Firebase uploadMedia error:', error);
      return { success: false, error: error.message };
    }
  }

  async saveMediaInfo(mediaData) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      const media = {
        ...mediaData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await this.db.collection('media').add(media);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Firebase saveMediaInfo error:', error);
      return { success: false, error: error.message };
    }
  }

  async getMedia() {
    if (!this.isFirebaseAvailable()) {
      console.warn('Firebase not available, returning empty media array');
      return { success: true, data: [] };
    }

    try {
      const snapshot = await this.db.collection('media')
        .orderBy('createdAt', 'desc')
        .get();
      
      const media = [];
      snapshot.forEach(doc => {
        media.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: media };
    } catch (error) {
      console.error('Firebase getMedia error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteMedia(id, url) {
    if (!this.isFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      // Delete from Firestore
      await this.db.collection('media').doc(id).delete();
      
      // Delete from Storage
      if (url) {
        const storageRef = this.storage.refFromURL(url);
        await storageRef.delete();
      }
      
      return { success: true };
    } catch (error) {
      console.error('Firebase deleteMedia error:', error);
      return { success: false, error: error.message };
    }
  }

  // Analytics Methods
  async trackPageView(page, userId = null) {
    if (!this.isFirebaseAvailable()) {
      console.warn('Firebase not available, skipping analytics tracking');
      return { success: true };
    }

    try {
      const analytics = {
        page,
        userId: userId || this.getCurrentUser()?.uid || 'anonymous',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      };

      await this.db.collection('analytics').add(analytics);
      return { success: true };
    } catch (error) {
      console.error('Firebase trackPageView error:', error);
      return { success: false, error: error.message };
    }
  }

  async getAnalytics(startDate, endDate) {
    if (!this.isFirebaseAvailable()) {
      console.warn('Firebase not available, returning empty analytics array');
      return { success: true, data: [] };
    }

    try {
      const snapshot = await this.db.collection('analytics')
        .where('timestamp', '>=', startDate)
        .where('timestamp', '<=', endDate)
        .get();
      
      const analytics = [];
      snapshot.forEach(doc => {
        analytics.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: analytics };
    } catch (error) {
      console.error('Firebase getAnalytics error:', error);
      return { success: false, error: error.message };
    }
  }

  // Utility Methods
  formatTimestamp(timestamp) {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    return new Date();
  }

  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

// Create global instance
window.firebaseService = new FirebaseService(); 