// Search functionality
const SEARCH = {
  articles: [],
  searchIndex: new Map(),
  
  // Initialize search
  init: (articles) => {
    SEARCH.articles = articles;
    SEARCH.buildSearchIndex();
    SEARCH.setupSearchUI();
  },

  // Build search index for better performance
  buildSearchIndex: () => {
    SEARCH.articles.forEach(article => {
      const searchableText = [
        article.title,
        article.excerpt,
        article.content || '',
        article.tags?.join(' ') || '',
        article.category
      ].join(' ').toLowerCase();
      
      SEARCH.searchIndex.set(article.id, searchableText);
    });
  },

  // Setup search UI
  setupSearchUI: () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput) return;
    
    // Debounced search
    const debouncedSearch = UTILS.debounce((query) => {
      SEARCH.performSearch(query);
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length >= 2) {
        debouncedSearch(query);
      } else {
        SEARCH.clearResults();
      }
    });
    
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        SEARCH.performSearch(searchInput.value.trim());
      }
    });
    
    if (searchButton) {
      searchButton.addEventListener('click', () => {
        SEARCH.performSearch(searchInput.value.trim());
      });
    }
  },

  // Perform search
  performSearch: (query) => {
    if (!query || query.length < 2) {
      SEARCH.clearResults();
      return;
    }
    
    const results = SEARCH.searchArticles(query);
    SEARCH.displayResults(results, query);
    
    // Track search analytics
    SEARCH.trackSearch(query, results.length);
  },

  // Search articles
  searchArticles: (query) => {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
    const results = [];
    
    SEARCH.articles.forEach(article => {
      const searchableText = SEARCH.searchIndex.get(article.id);
      let score = 0;
      
      searchTerms.forEach(term => {
        // Title matches get higher score
        if (article.title.toLowerCase().includes(term)) {
          score += 10;
        }
        
        // Excerpt matches get medium score
        if (article.excerpt.toLowerCase().includes(term)) {
          score += 5;
        }
        
        // General content matches get lower score
        if (searchableText.includes(term)) {
          score += 1;
        }
        
        // Category matches get medium score
        if (article.category.toLowerCase().includes(term)) {
          score += 3;
        }
      });
      
      if (score > 0) {
        results.push({ ...article, searchScore: score });
      }
    });
    
    // Sort by relevance score
    return results.sort((a, b) => b.searchScore - a.searchScore);
  },

  // Display search results
  displayResults: (results, query) => {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    searchResults.innerHTML = COMPONENTS.createSearchResults(results, query);
    searchResults.style.display = 'block';
    
    // Highlight search terms
    SEARCH.highlightSearchTerms(query);
  },

  // Clear search results
  clearResults: () => {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
      searchResults.innerHTML = '';
      searchResults.style.display = 'none';
    }
  },

  // Highlight search terms in results
  highlightSearchTerms: (query) => {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
    const resultElements = document.querySelectorAll('#search-results .article-title, #search-results .article-excerpt');
    
    resultElements.forEach(element => {
      let html = element.innerHTML;
      
      searchTerms.forEach(term => {
        const regex = new RegExp(`(${term})`, 'gi');
        html = html.replace(regex, '<mark>$1</mark>');
      });
      
      element.innerHTML = html;
    });
  },

  // Advanced search with filters
  advancedSearch: (query, filters = {}) => {
    let results = SEARCH.searchArticles(query);
    
    // Apply category filter
    if (filters.category) {
      results = results.filter(article => article.category === filters.category);
    }
    
    // Apply date filter
    if (filters.dateFrom) {
      results = results.filter(article => new Date(article.date) >= new Date(filters.dateFrom));
    }
    
    if (filters.dateTo) {
      results = results.filter(article => new Date(article.date) <= new Date(filters.dateTo));
    }
    
    // Apply author filter
    if (filters.author) {
      results = results.filter(article => article.author.includes(filters.author));
    }
    
    return results;
  },

  // Search suggestions
  getSuggestions: (query) => {
    const suggestions = new Set();
    const searchTerms = query.toLowerCase().split(' ');
    const lastTerm = searchTerms[searchTerms.length - 1];
    
    if (lastTerm.length < 2) return [];
    
    SEARCH.articles.forEach(article => {
      // Extract words from title and content
      const words = [
        ...article.title.toLowerCase().split(' '),
        ...article.excerpt.toLowerCase().split(' '),
        ...(article.tags || []).map(tag => tag.toLowerCase())
      ];
      
      words.forEach(word => {
        if (word.startsWith(lastTerm) && word.length > lastTerm.length) {
          suggestions.add(word);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  },

  // Track search analytics
  trackSearch: (query, resultCount) => {
    // Store search data for analytics
    const searchData = {
      query,
      resultCount,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    // Save to localStorage for analytics
    const searches = UTILS.storage.get('searches', []);
    searches.push(searchData);
    
    // Keep only last 100 searches
    if (searches.length > 100) {
      searches.splice(0, searches.length - 100);
    }
    
    UTILS.storage.set('searches', searches);
    
    // Log for debugging
    console.log('Search tracked:', searchData);
  },

  // Get popular searches
  getPopularSearches: () => {
    const searches = UTILS.storage.get('searches', []);
    const queryCount = {};
    
    searches.forEach(search => {
      queryCount[search.query] = (queryCount[search.query] || 0) + 1;
    });
    
    return Object.entries(queryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([query]) => query);
  },

  // Search autocomplete
  setupAutocomplete: () => {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const autocompleteContainer = document.createElement('div');
    autocompleteContainer.className = 'search-autocomplete';
    searchInput.parentNode.appendChild(autocompleteContainer);
    
    searchInput.addEventListener('input', UTILS.debounce((e) => {
      const query = e.target.value.trim();
      if (query.length >= 2) {
        const suggestions = SEARCH.getSuggestions(query);
        SEARCH.displayAutocomplete(suggestions, autocompleteContainer);
      } else {
        autocompleteContainer.innerHTML = '';
      }
    }, 200));
    
    // Hide autocomplete when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !autocompleteContainer.contains(e.target)) {
        autocompleteContainer.innerHTML = '';
      }
    });
  },

  // Display autocomplete suggestions
  displayAutocomplete: (suggestions, container) => {
    if (suggestions.length === 0) {
      container.innerHTML = '';
      return;
    }
    
    const html = suggestions.map(suggestion => 
      `<div class="autocomplete-item" onclick="SEARCH.selectSuggestion('${suggestion}')">${suggestion}</div>`
    ).join('');
    
    container.innerHTML = html;
  },

  // Select autocomplete suggestion
  selectSuggestion: (suggestion) => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = suggestion;
      SEARCH.performSearch(suggestion);
    }
  }
};

