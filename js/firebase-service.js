// Firebase Service Class
class FirebaseService {
  constructor() {
    this.auth = FIREBASE.auth;
    this.db = FIREBASE.db;
    this.storage = FIREBASE.storage;
  }

  // Authentication Methods
  async signIn(email, password) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signUp(email, password, displayName) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({ displayName });
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    try {
      await this.auth.signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  onAuthStateChanged(callback) {
    return this.auth.onAuthStateChanged(callback);
  }

  // Articles Methods
  async getArticles() {
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
      return { success: false, error: error.message };
    }
  }

  async getArticle(id) {
    try {
      const doc = await this.db.collection('articles').doc(id).get();
      if (doc.exists) {
        return { success: true, data: { id: doc.id, ...doc.data() } };
      } else {
        return { success: false, error: 'Article not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createArticle(articleData) {
    try {
      const article = {
        ...articleData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        authorId: this.getCurrentUser()?.uid || 'anonymous',
        views: 0,
        likes: 0
      };

      const docRef = await this.db.collection('articles').add(article);
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateArticle(id, articleData) {
    try {
      const article = {
        ...articleData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection('articles').doc(id).update(article);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteArticle(id) {
    try {
      await this.db.collection('articles').doc(id).delete();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async incrementArticleViews(id) {
    try {
      await this.db.collection('articles').doc(id).update({
        views: firebase.firestore.FieldValue.increment(1)
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Categories Methods
  async getCategories() {
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
      return { success: false, error: error.message };
    }
  }

  async createCategory(categoryData) {
    try {
      const category = {
        ...categoryData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        articleCount: 0
      };

      const docRef = await this.db.collection('categories').add(category);
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateCategory(id, categoryData) {
    try {
      const category = {
        ...categoryData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection('categories').doc(id).update(category);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteCategory(id) {
    try {
      await this.db.collection('categories').doc(id).delete();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Users Methods
  async getUsers() {
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
      return { success: false, error: error.message };
    }
  }

  async createUser(userData) {
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
      return { success: false, error: error.message };
    }
  }

  async updateUser(id, userData) {
    try {
      const user = {
        ...userData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection('users').doc(id).update(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteUser(id) {
    try {
      await this.db.collection('users').doc(id).delete();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Media Methods
  async uploadMedia(file, path) {
    try {
      const storageRef = this.storage.ref();
      const fileRef = storageRef.child(path);
      const snapshot = await fileRef.put(file);
      const downloadURL = await snapshot.ref.getDownloadURL();
      
      return { success: true, url: downloadURL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async saveMediaInfo(mediaData) {
    try {
      const media = {
        ...mediaData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await this.db.collection('media').add(media);
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getMedia() {
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
      return { success: false, error: error.message };
    }
  }

  async deleteMedia(id, url) {
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
      return { success: false, error: error.message };
    }
  }

  // Analytics Methods
  async trackPageView(page, userId = null) {
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
      return { success: false, error: error.message };
    }
  }

  async getAnalytics(startDate, endDate) {
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