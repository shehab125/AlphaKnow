// Users Management Module
class UsersManager {
  constructor() {
    this.users = [];
    this.loadFromStorage();
  }

  // CRUD operations
  async createUser(userData) {
    try {
      const user = {
        id: this.generateId(),
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        lastLogin: null,
        loginCount: 0
      };

      this.users.push(user);
      this.saveToStorage();
      
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id, updates) {
    try {
      const index = this.users.findIndex(user => user.id === id);
      if (index === -1) {
        throw new Error('User not found');
      }

      this.users[index] = {
        ...this.users[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      this.saveToStorage();
      return this.users[index];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const index = this.users.findIndex(user => user.id === id);
      if (index === -1) {
        throw new Error('User not found');
      }

      this.users.splice(index, 1);
      this.saveToStorage();
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUser(id) {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getAllUsers(filters = {}) {
    let filteredUsers = [...this.users];

    // Apply filters
    if (filters.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }

    if (filters.status) {
      filteredUsers = filteredUsers.filter(user => user.status === filters.status);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredUsers.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'name':
            return a.name.localeCompare(b.name, 'ar');
          case 'lastLogin':
            return new Date(b.lastLogin || 0) - new Date(a.lastLogin || 0);
          default:
            return 0;
        }
      });
    }

    return filteredUsers;
  }

  // Storage operations
  saveToStorage() {
    localStorage.setItem('alphaknow_users', JSON.stringify(this.users));
  }

  loadFromStorage() {
    const stored = localStorage.getItem('alphaknow_users');
    this.users = stored ? JSON.parse(stored) : this.getDefaultUsers();
  }

  getDefaultUsers() {
    return [
      {
        id: '1',
        name: 'مدير النظام',
        email: 'admin@alphaknow.com',
        role: 'admin',
        avatar: '../images/admin-avatar.jpg',
        status: 'active',
        registeredDate: '2024-01-01T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        lastLogin: '2024-01-15T10:30:00.000Z',
        loginCount: 25
      },
      {
        id: '2',
        name: 'كاتب المحتوى',
        email: 'writer@alphaknow.com',
        role: 'writer',
        avatar: '../images/writer-avatar.jpg',
        status: 'active',
        registeredDate: '2024-01-05T00:00:00.000Z',
        createdAt: '2024-01-05T00:00:00.000Z',
        updatedAt: '2024-01-05T00:00:00.000Z',
        lastLogin: '2024-01-14T15:45:00.000Z',
        loginCount: 12
      }
    ];
  }

  // Utility methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  validateUser(userData) {
    const errors = [];

    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('الاسم يجب أن يكون حرفين على الأقل');
    }

    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('البريد الإلكتروني غير صحيح');
    }

    if (!userData.role) {
      errors.push('يجب اختيار دور للمستخدم');
    }

    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Authentication
  async login(email, password) {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    if (user.status !== 'active') {
      throw new Error('الحساب غير نشط');
    }

    // Update login info
    user.lastLogin = new Date().toISOString();
    user.loginCount++;
    this.saveToStorage();

    return user;
  }

  async logout(userId) {
    // Clear session data
    localStorage.removeItem('admin_session');
    return true;
  }

  // Get users by role
  getUsersByRole(role) {
    return this.users.filter(user => user.role === role);
  }

  // Get active users
  getActiveUsers() {
    return this.users.filter(user => user.status === 'active');
  }

  // Get inactive users
  getInactiveUsers() {
    return this.users.filter(user => user.status === 'inactive');
  }

  // Search users
  searchUsers(query) {
    const searchTerm = query.toLowerCase();
    return this.users.filter(user =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }

  // Bulk operations
  async bulkUpdate(userIds, updates) {
    try {
      const updatedUsers = [];
      
      for (const id of userIds) {
        const user = await this.updateUser(id, updates);
        updatedUsers.push(user);
      }
      
      return updatedUsers;
    } catch (error) {
      console.error('Error in bulk update:', error);
      throw error;
    }
  }

  async bulkDelete(userIds) {
    try {
      const deletedUsers = [];
      
      for (const id of userIds) {
        await this.deleteUser(id);
        deletedUsers.push(id);
      }
      
      return deletedUsers;
    } catch (error) {
      console.error('Error in bulk delete:', error);
      throw error;
    }
  }

  // Export/Import functionality
  exportUsers() {
    const dataStr = JSON.stringify(this.users, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `users-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  async importUsers(file) {
    try {
      const text = await file.text();
      const importedUsers = JSON.parse(text);
      
      // Validate imported data
      if (!Array.isArray(importedUsers)) {
        throw new Error('Invalid file format');
      }

      // Merge with existing users
      this.users = [...this.users, ...importedUsers];
      this.saveToStorage();
      
      return importedUsers.length;
    } catch (error) {
      console.error('Error importing users:', error);
      throw error;
    }
  }

  // Get user statistics
  getUserStats() {
    const totalUsers = this.users.length;
    const activeUsers = this.getActiveUsers().length;
    const inactiveUsers = this.getInactiveUsers().length;
    const adminUsers = this.getUsersByRole('admin').length;
    const writerUsers = this.getUsersByRole('writer').length;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminUsers,
      writerUsers
    };
  }

  // Get recent users
  getRecentUsers(limit = 10) {
    return this.users
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  // Get users with most logins
  getMostActiveUsers(limit = 10) {
    return this.users
      .sort((a, b) => (b.loginCount || 0) - (a.loginCount || 0))
      .slice(0, limit);
  }

  // Duplicate user
  async duplicateUser(id) {
    try {
      const originalUser = await this.getUser(id);
      const duplicatedUser = {
        ...originalUser,
        id: this.generateId(),
        name: `${originalUser.name} (نسخة)`,
        email: `copy_${originalUser.email}`,
        status: 'inactive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: null,
        loginCount: 0
      };

      delete duplicatedUser.id;
      return await this.createUser(duplicatedUser);
    } catch (error) {
      console.error('Error duplicating user:', error);
      throw error;
    }
  }

  // Change user status
  async changeUserStatus(id, status) {
    return await this.updateUser(id, { status });
  }

  // Reset user password
  async resetUserPassword(id) {
    const newPassword = this.generatePassword();
    await this.updateUser(id, { password: newPassword });
    return newPassword;
  }

  generatePassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Get user activity
  getUserActivity(userId, days = 30) {
    const user = this.users.find(u => u.id === userId);
    if (!user) return null;

    const now = new Date();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
    const daysSinceLastLogin = lastLogin ? Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24)) : null;

    return {
      user,
      lastLogin,
      daysSinceLastLogin,
      loginCount: user.loginCount || 0,
      isActive: daysSinceLastLogin !== null && daysSinceLastLogin <= days
    };
  }

  // Get all users activity
  getAllUsersActivity(days = 30) {
    return this.users.map(user => this.getUserActivity(user.id, days));
  }
}

// Initialize users manager
const usersManager = new UsersManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UsersManager;
} else {
  window.UsersManager = UsersManager;
  window.usersManager = usersManager;
} 