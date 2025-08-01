// Analytics Module
class AnalyticsManager {
  constructor() {
    this.analytics = {
      visits: [],
      pageViews: [],
      articles: [],
      users: [],
      categories: []
    };
    this.loadFromStorage();
  }

  // Track page visit
  trackPageVisit(page, referrer = null) {
    const visit = {
      id: this.generateId(),
      page,
      referrer,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language
    };

    this.analytics.visits.push(visit);
    this.saveToStorage();
    return visit;
  }

  // Track page view
  trackPageView(page, title = '') {
    const pageView = {
      id: this.generateId(),
      page,
      title,
      timestamp: new Date().toISOString(),
      duration: 0
    };

    this.analytics.pageViews.push(pageView);
    this.saveToStorage();
    return pageView;
  }

  // Track article view
  trackArticleView(articleId, articleTitle) {
    const articleView = {
      id: this.generateId(),
      articleId,
      articleTitle,
      timestamp: new Date().toISOString(),
      duration: 0
    };

    this.analytics.articles.push(articleView);
    this.saveToStorage();
    return articleView;
  }

  // Track user action
  trackUserAction(action, details = {}) {
    const userAction = {
      id: this.generateId(),
      action,
      details,
      timestamp: new Date().toISOString()
    };

    this.analytics.users.push(userAction);
    this.saveToStorage();
    return userAction;
  }

  // Track category view
  trackCategoryView(categoryId, categoryName) {
    const categoryView = {
      id: this.generateId(),
      categoryId,
      categoryName,
      timestamp: new Date().toISOString()
    };

    this.analytics.categories.push(categoryView);
    this.saveToStorage();
    return categoryView;
  }

  // Get analytics data
  getAnalyticsData(period = '30d') {
    const now = new Date();
    const periodStart = this.getPeriodStart(period);

    const visits = this.analytics.visits.filter(v => new Date(v.timestamp) >= periodStart);
    const pageViews = this.analytics.pageViews.filter(pv => new Date(pv.timestamp) >= periodStart);
    const articles = this.analytics.articles.filter(a => new Date(a.timestamp) >= periodStart);
    const users = this.analytics.users.filter(u => new Date(u.timestamp) >= periodStart);
    const categories = this.analytics.categories.filter(c => new Date(c.timestamp) >= periodStart);

    return {
      visits,
      pageViews,
      articles,
      users,
      categories,
      period: {
        start: periodStart,
        end: now,
        days: Math.ceil((now - periodStart) / (1000 * 60 * 60 * 24))
      }
    };
  }

  // Get period start date
  getPeriodStart(period) {
    const now = new Date();
    switch (period) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  // Get visits statistics
  getVisitsStats(period = '30d') {
    const data = this.getAnalyticsData(period);
    const visits = data.visits;

    // Group by date
    const visitsByDate = {};
    visits.forEach(visit => {
      const date = visit.timestamp.split('T')[0];
      visitsByDate[date] = (visitsByDate[date] || 0) + 1;
    });

    // Get unique visitors
    const uniqueVisitors = new Set(visits.map(v => v.userAgent)).size;

    // Get top pages
    const pageVisits = {};
    visits.forEach(visit => {
      pageVisits[visit.page] = (pageVisits[visit.page] || 0) + 1;
    });

    const topPages = Object.entries(pageVisits)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    return {
      totalVisits: visits.length,
      uniqueVisitors,
      averageVisitsPerDay: visits.length / data.period.days,
      topPages,
      visitsByDate
    };
  }

  // Get page views statistics
  getPageViewsStats(period = '30d') {
    const data = this.getAnalyticsData(period);
    const pageViews = data.pageViews;

    // Group by page
    const pageViewsByPage = {};
    pageViews.forEach(pv => {
      pageViewsByPage[pv.page] = (pageViewsByPage[pv.page] || 0) + 1;
    });

    const topPages = Object.entries(pageViewsByPage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    return {
      totalPageViews: pageViews.length,
      averagePageViewsPerDay: pageViews.length / data.period.days,
      topPages
    };
  }

  // Get articles statistics
  getArticlesStats(period = '30d') {
    const data = this.getAnalyticsData(period);
    const articles = data.articles;

    // Group by article
    const articleViews = {};
    articles.forEach(article => {
      articleViews[article.articleId] = (articleViews[article.articleId] || 0) + 1;
    });

    const topArticles = Object.entries(articleViews)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([articleId, count]) => {
        const article = articles.find(a => a.articleId === articleId);
        return {
          articleId,
          title: article?.articleTitle || 'Unknown',
          views: count
        };
      });

    return {
      totalArticleViews: articles.length,
      averageArticleViewsPerDay: articles.length / data.period.days,
      topArticles
    };
  }

  // Get categories statistics
  getCategoriesStats(period = '30d') {
    const data = this.getAnalyticsData(period);
    const categories = data.categories;

    // Group by category
    const categoryViews = {};
    categories.forEach(category => {
      categoryViews[category.categoryId] = (categoryViews[category.categoryId] || 0) + 1;
    });

    const topCategories = Object.entries(categoryViews)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([categoryId, count]) => {
        const category = categories.find(c => c.categoryId === categoryId);
        return {
          categoryId,
          name: category?.categoryName || 'Unknown',
          views: count
        };
      });

    return {
      totalCategoryViews: categories.length,
      averageCategoryViewsPerDay: categories.length / data.period.days,
      topCategories
    };
  }

  // Get user engagement statistics
  getUserEngagementStats(period = '30d') {
    const data = this.getAnalyticsData(period);
    const users = data.users;

    // Group by action
    const actionCounts = {};
    users.forEach(user => {
      actionCounts[user.action] = (actionCounts[user.action] || 0) + 1;
    });

    const topActions = Object.entries(actionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([action, count]) => ({ action, count }));

    return {
      totalActions: users.length,
      averageActionsPerDay: users.length / data.period.days,
      topActions
    };
  }

  // Get chart data for visits
  getVisitsChartData(period = '30d') {
    const stats = this.getVisitsStats(period);
    const visitsByDate = stats.visitsByDate;

    // Create date range
    const dates = [];
    const periodStart = this.getPeriodStart(period);
    const now = new Date();

    for (let d = new Date(periodStart); d <= now; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }

    const labels = dates.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
    });

    const data = dates.map(date => visitsByDate[date] || 0);

    return {
      labels,
      data,
      datasets: [{
        label: 'الزيارات',
        data,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4
      }]
    };
  }

  // Get chart data for articles
  getArticlesChartData(period = '30d') {
    const stats = this.getArticlesStats(period);
    const topArticles = stats.topArticles.slice(0, 5);

    return {
      labels: topArticles.map(article => article.title),
      data: topArticles.map(article => article.views),
      datasets: [{
        data: topArticles.map(article => article.views),
        backgroundColor: [
          '#1a365d',
          '#3182ce',
          '#38a169',
          '#d69e2e',
          '#e53e3e'
        ]
      }]
    };
  }

  // Get chart data for categories
  getCategoriesChartData(period = '30d') {
    const stats = this.getCategoriesStats(period);
    const topCategories = stats.topCategories.slice(0, 5);

    return {
      labels: topCategories.map(category => category.name),
      data: topCategories.map(category => category.views),
      datasets: [{
        data: topCategories.map(category => category.views),
        backgroundColor: [
          '#805ad5',
          '#3182ce',
          '#38a169',
          '#d69e2e',
          '#e53e3e'
        ]
      }]
    };
  }

  // Get real-time statistics
  getRealTimeStats() {
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const visitsLastHour = this.analytics.visits.filter(v => new Date(v.timestamp) >= lastHour).length;
    const visitsLast24Hours = this.analytics.visits.filter(v => new Date(v.timestamp) >= last24Hours).length;
    const pageViewsLastHour = this.analytics.pageViews.filter(pv => new Date(pv.timestamp) >= lastHour).length;
    const pageViewsLast24Hours = this.analytics.pageViews.filter(pv => new Date(pv.timestamp) >= last24Hours).length;

    return {
      visitsLastHour,
      visitsLast24Hours,
      pageViewsLastHour,
      pageViewsLast24Hours,
      currentTime: now.toISOString()
    };
  }

  // Get device statistics
  getDeviceStats(period = '30d') {
    const data = this.getAnalyticsData(period);
    const visits = data.visits;

    const devices = {
      desktop: 0,
      mobile: 0,
      tablet: 0
    };

    visits.forEach(visit => {
      const userAgent = visit.userAgent.toLowerCase();
      if (userAgent.includes('mobile')) {
        devices.mobile++;
      } else if (userAgent.includes('tablet')) {
        devices.tablet++;
      } else {
        devices.desktop++;
      }
    });

    return devices;
  }

  // Get browser statistics
  getBrowserStats(period = '30d') {
    const data = this.getAnalyticsData(period);
    const visits = data.visits;

    const browsers = {};

    visits.forEach(visit => {
      const userAgent = visit.userAgent.toLowerCase();
      let browser = 'Unknown';

      if (userAgent.includes('chrome')) {
        browser = 'Chrome';
      } else if (userAgent.includes('firefox')) {
        browser = 'Firefox';
      } else if (userAgent.includes('safari')) {
        browser = 'Safari';
      } else if (userAgent.includes('edge')) {
        browser = 'Edge';
      } else if (userAgent.includes('opera')) {
        browser = 'Opera';
      }

      browsers[browser] = (browsers[browser] || 0) + 1;
    });

    return Object.entries(browsers)
      .sort(([,a], [,b]) => b - a)
      .map(([browser, count]) => ({ browser, count }));
  }

  // Export analytics data
  exportAnalytics(period = '30d') {
    const data = this.getAnalyticsData(period);
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `analytics-${period}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  // Clear old data
  clearOldData(daysToKeep = 365) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    this.analytics.visits = this.analytics.visits.filter(v => new Date(v.timestamp) >= cutoffDate);
    this.analytics.pageViews = this.analytics.pageViews.filter(pv => new Date(pv.timestamp) >= cutoffDate);
    this.analytics.articles = this.analytics.articles.filter(a => new Date(a.timestamp) >= cutoffDate);
    this.analytics.users = this.analytics.users.filter(u => new Date(u.timestamp) >= cutoffDate);
    this.analytics.categories = this.analytics.categories.filter(c => new Date(c.timestamp) >= cutoffDate);

    this.saveToStorage();
  }

  // Storage operations
  saveToStorage() {
    localStorage.setItem('alphaknow_analytics', JSON.stringify(this.analytics));
  }

  loadFromStorage() {
    const stored = localStorage.getItem('alphaknow_analytics');
    this.analytics = stored ? JSON.parse(stored) : {
      visits: [],
      pageViews: [],
      articles: [],
      users: [],
      categories: []
    };
  }

  // Utility methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Format number
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  }
}

// Initialize analytics manager
const analyticsManager = new AnalyticsManager();

// Auto-track page visits
document.addEventListener('DOMContentLoaded', () => {
  analyticsManager.trackPageVisit(window.location.pathname, document.referrer);
});

// Auto-track page views
window.addEventListener('load', () => {
  analyticsManager.trackPageView(window.location.pathname, document.title);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnalyticsManager;
} else {
  window.AnalyticsManager = AnalyticsManager;
  window.analyticsManager = analyticsManager;
} 