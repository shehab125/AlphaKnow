// Categories Management Module
class CategoriesManager {
  constructor() {
    this.categories = [];
    this.loadFromStorage();
  }

  // CRUD operations
  async createCategory(categoryData) {
    try {
      const category = {
        id: this.generateId(),
        ...categoryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        articleCount: 0
      };

      this.categories.push(category);
      this.saveToStorage();
      
      return category;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id, updates) {
    try {
      const index = this.categories.findIndex(category => category.id === id);
      if (index === -1) {
        throw new Error('Category not found');
      }

      this.categories[index] = {
        ...this.categories[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      this.saveToStorage();
      return this.categories[index];
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      const index = this.categories.findIndex(category => category.id === id);
      if (index === -1) {
        throw new Error('Category not found');
      }

      // Check if category has articles
      if (this.categories[index].articleCount > 0) {
        throw new Error('Cannot delete category with articles');
      }

      this.categories.splice(index, 1);
      this.saveToStorage();
      
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  async getCategory(id) {
    const category = this.categories.find(category => category.id === id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async getAllCategories() {
    return [...this.categories];
  }

  // Storage operations
  saveToStorage() {
    localStorage.setItem('alphaknow_categories', JSON.stringify(this.categories));
  }

  loadFromStorage() {
    const stored = localStorage.getItem('alphaknow_categories');
    this.categories = stored ? JSON.parse(stored) : this.getDefaultCategories();
  }

  getDefaultCategories() {
    return [
      {
        id: 'entrepreneurship',
        name: 'ريادة الأعمال',
        description: 'مقالات عن ريادة الأعمال والشركات الناشئة',
        color: '#1a365d',
        icon: 'layers',
        slug: 'entrepreneurship',
        articleCount: 5,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'ecommerce',
        name: 'التجارة الإلكترونية',
        description: 'مقالات عن التجارة الإلكترونية والمتاجر الإلكترونية',
        color: '#3182ce',
        icon: 'shopping-cart',
        slug: 'ecommerce',
        articleCount: 3,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'marketing',
        name: 'التسويق الرقمي',
        description: 'مقالات عن التسويق الرقمي واستراتيجيات التسويق',
        color: '#38a169',
        icon: 'megaphone',
        slug: 'marketing',
        articleCount: 4,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'freelancing',
        name: 'العمل الحر',
        description: 'مقالات عن العمل الحر والخدمات الاستشارية',
        color: '#d69e2e',
        icon: 'briefcase',
        slug: 'freelancing',
        articleCount: 2,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'investment',
        name: 'الاستثمار الرقمي',
        description: 'مقالات عن الاستثمار في المشاريع الرقمية',
        color: '#e53e3e',
        icon: 'trending-up',
        slug: 'investment',
        articleCount: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'tools',
        name: 'الأدوات والموارد',
        description: 'مقالات عن الأدوات والموارد المفيدة',
        color: '#805ad5',
        icon: 'tool',
        slug: 'tools',
        articleCount: 3,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ];
  }

  // Utility methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  validateCategory(categoryData) {
    const errors = [];

    if (!categoryData.name || categoryData.name.trim().length < 2) {
      errors.push('اسم الفئة يجب أن يكون حرفين على الأقل');
    }

    if (!categoryData.color) {
      errors.push('يجب اختيار لون للفئة');
    }

    if (!categoryData.icon) {
      errors.push('يجب اختيار أيقونة للفئة');
    }

    return errors;
  }

  // Update article count
  updateArticleCount(categoryId, increment = 1) {
    const category = this.categories.find(c => c.id === categoryId);
    if (category) {
      category.articleCount += increment;
      category.updatedAt = new Date().toISOString();
      this.saveToStorage();
    }
  }

  // Get categories with article count
  getCategoriesWithCount() {
    return this.categories.map(category => ({
      ...category,
      articleCount: category.articleCount || 0
    }));
  }

  // Get popular categories
  getPopularCategories(limit = 5) {
    return this.categories
      .sort((a, b) => (b.articleCount || 0) - (a.articleCount || 0))
      .slice(0, limit);
  }

  // Search categories
  searchCategories(query) {
    const searchTerm = query.toLowerCase();
    return this.categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm) ||
      category.description.toLowerCase().includes(searchTerm)
    );
  }

  // Bulk operations
  async bulkUpdate(categoryIds, updates) {
    try {
      const updatedCategories = [];
      
      for (const id of categoryIds) {
        const category = await this.updateCategory(id, updates);
        updatedCategories.push(category);
      }
      
      return updatedCategories;
    } catch (error) {
      console.error('Error in bulk update:', error);
      throw error;
    }
  }

  async bulkDelete(categoryIds) {
    try {
      const deletedCategories = [];
      
      for (const id of categoryIds) {
        await this.deleteCategory(id);
        deletedCategories.push(id);
      }
      
      return deletedCategories;
    } catch (error) {
      console.error('Error in bulk delete:', error);
      throw error;
    }
  }

  // Export/Import functionality
  exportCategories() {
    const dataStr = JSON.stringify(this.categories, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `categories-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  async importCategories(file) {
    try {
      const text = await file.text();
      const importedCategories = JSON.parse(text);
      
      // Validate imported data
      if (!Array.isArray(importedCategories)) {
        throw new Error('Invalid file format');
      }

      // Merge with existing categories
      this.categories = [...this.categories, ...importedCategories];
      this.saveToStorage();
      
      return importedCategories.length;
    } catch (error) {
      console.error('Error importing categories:', error);
      throw error;
    }
  }

  // Get category statistics
  getCategoryStats() {
    const totalCategories = this.categories.length;
    const totalArticles = this.categories.reduce((sum, cat) => sum + (cat.articleCount || 0), 0);
    const averageArticles = totalCategories > 0 ? Math.round(totalArticles / totalCategories) : 0;
    const emptyCategories = this.categories.filter(cat => (cat.articleCount || 0) === 0).length;

    return {
      totalCategories,
      totalArticles,
      averageArticles,
      emptyCategories
    };
  }
}

// Initialize categories manager
const categoriesManager = new CategoriesManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CategoriesManager;
} else {
  window.CategoriesManager = CategoriesManager;
  window.categoriesManager = categoriesManager;
} 