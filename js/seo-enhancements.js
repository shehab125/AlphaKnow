// SEO Enhancements for Dynamic Content
class SEOEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.setupMetaTagUpdates();
    this.setupStructuredData();
    this.setupSitemap();
    this.setupRobotsTxt();
  }

  // Update meta tags dynamically based on content
  updateMetaTags(data) {
    const metaTags = {
      title: data.title || 'ريادة الأعمال الرقمية',
      description: data.description || 'المدونة الرائدة في الوطن العربي لريادة الأعمال الرقمية',
      keywords: data.keywords || 'ريادة الأعمال, الربح من الإنترنت, التجارة الإلكترونية',
      ogTitle: data.ogTitle || data.title,
      ogDescription: data.ogDescription || data.description,
      ogImage: data.ogImage || 'https://alpha-know.vercel.app/images/og-image.jpg'
    };

    // Update title
    document.title = metaTags.title;

    // Update meta description
    this.updateMetaTag('name', 'description', metaTags.description);
    this.updateMetaTag('name', 'keywords', metaTags.keywords);

    // Update Open Graph tags
    this.updateMetaTag('property', 'og:title', metaTags.ogTitle);
    this.updateMetaTag('property', 'og:description', metaTags.ogDescription);
    this.updateMetaTag('property', 'og:image', metaTags.ogImage);

    // Update Twitter Card tags
    this.updateMetaTag('name', 'twitter:title', metaTags.ogTitle);
    this.updateMetaTag('name', 'twitter:description', metaTags.ogDescription);
    this.updateMetaTag('name', 'twitter:image', metaTags.ogImage);
  }

  updateMetaTag(attribute, name, content) {
    let tag = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attribute, name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }

  // Add structured data for articles
  addArticleStructuredData(article) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.excerpt,
      "image": article.image,
      "author": {
        "@type": "Person",
        "name": article.author || "فريق ريادة الأعمال الرقمية"
      },
      "publisher": {
        "@type": "Organization",
        "name": "ريادة الأعمال الرقمية",
        "logo": {
          "@type": "ImageObject",
          "url": "https://alpha-know.vercel.app/images/logo.png"
        }
      },
      "datePublished": article.date,
      "dateModified": article.dateModified || article.date,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://alpha-know.vercel.app/article/${article.id}`
      },
      "articleSection": article.category,
      "wordCount": article.wordCount || 1000,
      "inLanguage": "ar"
    };

    this.addStructuredDataScript(structuredData);
  }

  // Add breadcrumb structured data
  addBreadcrumbStructuredData(breadcrumbs) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };

    this.addStructuredDataScript(structuredData);
  }

  addStructuredDataScript(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Generate sitemap data
  generateSitemap() {
    const pages = [
      { url: 'https://alpha-know.vercel.app/', priority: 1.0, changefreq: 'daily' },
      { url: 'https://alpha-know.vercel.app/articles/', priority: 0.9, changefreq: 'daily' },
      { url: 'https://alpha-know.vercel.app/categories/', priority: 0.8, changefreq: 'weekly' },
      { url: 'https://alpha-know.vercel.app/about/', priority: 0.7, changefreq: 'monthly' },
      { url: 'https://alpha-know.vercel.app/contact/', priority: 0.6, changefreq: 'monthly' }
    ];

    return pages;
  }

  // Setup canonical URLs
  setupCanonicalURL(url) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url || window.location.href;
  }

  // Setup hreflang for multilingual support
  setupHreflang() {
    const hreflang = document.createElement('link');
    hreflang.rel = 'alternate';
    hreflang.hreflang = 'ar';
    hreflang.href = window.location.href;
    document.head.appendChild(hreflang);
  }

  // Monitor Core Web Vitals
  monitorCoreWebVitals() {
    if ('web-vital' in window) {
      import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
  }

  setupMetaTagUpdates() {
    // Setup canonical URL
    this.setupCanonicalURL();
    
    // Setup hreflang
    this.setupHreflang();
  }

  setupStructuredData() {
    // Add organization structured data
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ريادة الأعمال الرقمية",
      "url": "https://alpha-know.vercel.app",
      "logo": "https://alpha-know.vercel.app/images/logo.png",
      "sameAs": [
        "https://twitter.com/alpha_know",
        "https://facebook.com/alpha.know",
        "https://linkedin.com/company/alpha-know"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+966-XX-XXX-XXXX",
        "contactType": "customer service",
        "availableLanguage": "Arabic"
      }
    };

    this.addStructuredDataScript(organizationData);
  }

  setupSitemap() {
    // This would typically be handled server-side
    // For client-side, we can at least log the sitemap structure
    const sitemap = this.generateSitemap();
    console.log('Sitemap structure:', sitemap);
  }

  setupRobotsTxt() {
    // This would typically be a static file
    // For reference, the robots.txt should contain:
    const robotsTxt = `
User-agent: *
Allow: /
Sitemap: https://alpha-know.vercel.app/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
    `.trim();
    
    console.log('Robots.txt content:', robotsTxt);
  }
}

// Initialize SEO enhancements
document.addEventListener('DOMContentLoaded', () => {
  new SEOEnhancements();
});

