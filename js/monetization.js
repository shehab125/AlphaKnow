// Monetization System for AlphaKnow
class MonetizationManager {
    constructor() {
        this.adsConfig = {
            enabled: true,
            adSenseId: 'ca-pub-XXXXXXXXXX', // Replace with actual AdSense ID
            adSlots: {
                header: 'XXXXXXXXXX',
                sidebar: 'XXXXXXXXXX',
                inArticle: 'XXXXXXXXXX',
                footer: 'XXXXXXXXXX'
            }
        };
        
        this.affiliateConfig = {
            enabled: true,
            trackingEnabled: true,
            defaultCommission: 0.05 // 5%
        };
        
        this.premiumConfig = {
            enabled: true,
            monthlyPrice: 29.99,
            yearlyPrice: 299.99,
            currency: 'USD'
        };
        
        this.init();
    }

    init() {
        this.initializeAds();
        this.initializeAffiliateTracking();
        this.initializePremiumFeatures();
        this.initializeAnalytics();
    }

    // Google AdSense Integration
    initializeAds() {
        if (!this.adsConfig.enabled) return;

        // Load AdSense script
        this.loadAdSenseScript();
        
        // Initialize ad slots
        this.initializeAdSlots();
        
        // Setup lazy loading for ads
        this.setupAdLazyLoading();
    }

    loadAdSenseScript() {
        if (document.querySelector('script[src*="adsbygoogle"]')) return;

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.adsConfig.adSenseId}`;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);

        // Initialize AdSense
        script.onload = () => {
            (window.adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: this.adsConfig.adSenseId,
                enable_page_level_ads: true
            });
        };
    }

    initializeAdSlots() {
        // Header Banner Ad
        this.createAdSlot('header-ad', {
            slot: this.adsConfig.adSlots.header,
            size: [[728, 90], [320, 50]],
            responsive: true
        });

        // Sidebar Ad
        this.createAdSlot('sidebar-ad', {
            slot: this.adsConfig.adSlots.sidebar,
            size: [[300, 250], [336, 280]],
            responsive: true
        });

        // In-Article Ad
        this.createAdSlot('article-ad', {
            slot: this.adsConfig.adSlots.inArticle,
            size: [[728, 90], [300, 250]],
            responsive: true
        });

        // Footer Ad
        this.createAdSlot('footer-ad', {
            slot: this.adsConfig.adSlots.footer,
            size: [[728, 90], [320, 50]],
            responsive: true
        });
    }

    createAdSlot(containerId, config) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.setAttribute('data-ad-client', this.adsConfig.adSenseId);
        adElement.setAttribute('data-ad-slot', config.slot);
        
        if (config.responsive) {
            adElement.setAttribute('data-ad-format', 'auto');
            adElement.setAttribute('data-full-width-responsive', 'true');
        } else {
            adElement.style.width = config.size[0][0] + 'px';
            adElement.style.height = config.size[0][1] + 'px';
        }

        container.appendChild(adElement);

        // Push ad to AdSense queue
        setTimeout(() => {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error('AdSense error:', e);
            }
        }, 100);
    }

    setupAdLazyLoading() {
        const adContainers = document.querySelectorAll('.ad-slot');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.loaded) {
                    this.loadAd(entry.target);
                    entry.target.dataset.loaded = 'true';
                }
            });
        }, {
            rootMargin: '100px'
        });

        adContainers.forEach(container => {
            observer.observe(container);
        });
    }

    loadAd(container) {
        const adConfig = container.dataset.adConfig;
        if (adConfig) {
            const config = JSON.parse(adConfig);
            this.createAdSlot(container.id, config);
        }
    }

    // Affiliate Marketing System
    initializeAffiliateTracking() {
        if (!this.affiliateConfig.enabled) return;

        this.setupAffiliateLinks();
        this.trackAffiliateClicks();
        this.initializeAffiliateDisclosures();
    }

    setupAffiliateLinks() {
        // Common affiliate programs
        this.affiliatePrograms = {
            amazon: {
                baseUrl: 'https://amazon.com',
                tag: 'alphaknow-20', // Replace with actual affiliate tag
                trackingParam: 'tag'
            },
            clickbank: {
                baseUrl: 'https://clickbank.com',
                tag: 'alphaknow', // Replace with actual affiliate ID
                trackingParam: 'tid'
            },
            commission_junction: {
                baseUrl: 'https://cj.com',
                tag: 'alphaknow', // Replace with actual affiliate ID
                trackingParam: 'aid'
            }
        };

        // Auto-convert affiliate links
        this.convertAffiliateLinks();
    }

    convertAffiliateLinks() {
        const links = document.querySelectorAll('a[href*="amazon.com"], a[href*="clickbank.com"]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            const convertedUrl = this.addAffiliateTracking(href);
            
            if (convertedUrl !== href) {
                link.setAttribute('href', convertedUrl);
                link.setAttribute('rel', 'nofollow sponsored');
                link.setAttribute('target', '_blank');
                
                // Add affiliate disclosure
                if (!link.querySelector('.affiliate-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'affiliate-badge';
                    badge.textContent = 'رابط تابع';
                    badge.style.cssText = `
                        font-size: 0.7rem;
                        background: #ff6b35;
                        color: white;
                        padding: 2px 6px;
                        border-radius: 3px;
                        margin-right: 5px;
                        vertical-align: super;
                    `;
                    link.appendChild(badge);
                }
            }
        });
    }

    addAffiliateTracking(url) {
        try {
            const urlObj = new URL(url);
            
            // Amazon affiliate tracking
            if (urlObj.hostname.includes('amazon.com')) {
                urlObj.searchParams.set('tag', this.affiliatePrograms.amazon.tag);
                return urlObj.toString();
            }
            
            // ClickBank affiliate tracking
            if (urlObj.hostname.includes('clickbank.com')) {
                urlObj.searchParams.set('tid', this.affiliatePrograms.clickbank.tag);
                return urlObj.toString();
            }
            
            return url;
        } catch (e) {
            return url;
        }
    }

    trackAffiliateClicks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[rel*="sponsored"]');
            if (link) {
                this.recordAffiliateClick(link);
            }
        });
    }

    recordAffiliateClick(link) {
        const data = {
            url: link.href,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            referrer: document.referrer
        };

        // Send to analytics
        this.sendAnalyticsEvent('affiliate_click', data);
        
        // Store locally for reporting
        const clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
        clicks.push(data);
        localStorage.setItem('affiliate_clicks', JSON.stringify(clicks.slice(-100))); // Keep last 100 clicks
    }

    initializeAffiliateDisclosures() {
        // Add general affiliate disclosure to footer
        const footer = document.querySelector('footer');
        if (footer && !footer.querySelector('.affiliate-disclosure')) {
            const disclosure = document.createElement('div');
            disclosure.className = 'affiliate-disclosure';
            disclosure.innerHTML = `
                <p style="font-size: 0.8rem; color: #666; text-align: center; margin: 1rem 0;">
                    <strong>إفصاح:</strong> قد تحتوي هذه الصفحة على روابط تابعة. نحصل على عمولة صغيرة عند الشراء من خلال هذه الروابط دون تكلفة إضافية عليك.
                </p>
            `;
            footer.appendChild(disclosure);
        }
    }

    // Premium Content System
    initializePremiumFeatures() {
        if (!this.premiumConfig.enabled) return;

        this.setupPaywall();
        this.initializeMembershipButtons();
        this.checkUserSubscription();
    }

    setupPaywall() {
        const premiumContent = document.querySelectorAll('.premium-content');
        
        premiumContent.forEach(content => {
            if (!this.isUserPremium()) {
                this.addPaywall(content);
            }
        });
    }

    addPaywall(content) {
        const paywall = document.createElement('div');
        paywall.className = 'paywall-overlay';
        paywall.innerHTML = `
            <div class="paywall-content">
                <div class="paywall-icon">
                    <i class="fas fa-crown"></i>
                </div>
                <h3>محتوى حصري للأعضاء المميزين</h3>
                <p>اشترك الآن للوصول إلى المحتوى الحصري والمتقدم</p>
                <div class="paywall-buttons">
                    <button class="btn btn-primary" onclick="monetizationManager.showSubscriptionModal()">
                        اشترك الآن - ${this.premiumConfig.monthlyPrice}$ شهرياً
                    </button>
                    <button class="btn btn-outline" onclick="monetizationManager.showLoginModal()">
                        تسجيل الدخول
                    </button>
                </div>
            </div>
        `;

        paywall.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95));
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            border-radius: 8px;
        `;

        content.style.position = 'relative';
        content.appendChild(paywall);
    }

    initializeMembershipButtons() {
        // Add subscription buttons to strategic locations
        this.addSubscriptionCTA();
    }

    addSubscriptionCTA() {
        const ctaHtml = `
            <div class="subscription-cta" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 2rem;
                border-radius: 12px;
                text-align: center;
                margin: 2rem 0;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            ">
                <h3 style="margin-bottom: 1rem;">انضم إلى الأعضاء المميزين</h3>
                <p style="margin-bottom: 1.5rem; opacity: 0.9;">
                    احصل على وصول حصري للمحتوى المتقدم، الكورسات، والاستشارات الشخصية
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-light" onclick="monetizationManager.showSubscriptionModal('monthly')" style="
                        background: white;
                        color: #667eea;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 6px;
                        font-weight: 600;
                        cursor: pointer;
                    ">
                        ${this.premiumConfig.monthlyPrice}$ شهرياً
                    </button>
                    <button class="btn btn-outline" onclick="monetizationManager.showSubscriptionModal('yearly')" style="
                        background: transparent;
                        color: white;
                        border: 2px solid white;
                        padding: 0.75rem 1.5rem;
                        border-radius: 6px;
                        font-weight: 600;
                        cursor: pointer;
                    ">
                        ${this.premiumConfig.yearlyPrice}$ سنوياً (وفر 17%)
                    </button>
                </div>
            </div>
        `;

        // Add to article pages
        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
            const ctaElement = document.createElement('div');
            ctaElement.innerHTML = ctaHtml;
            articleContent.appendChild(ctaElement);
        }

        // Add to sidebar
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            const ctaElement = document.createElement('div');
            ctaElement.innerHTML = ctaHtml;
            sidebar.appendChild(ctaElement);
        }
    }

    showSubscriptionModal(plan = 'monthly') {
        const modal = document.createElement('div');
        modal.className = 'subscription-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>اختر خطة الاشتراك</h2>
                    <button onclick="this.closest('.subscription-modal').remove()" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                    ">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="pricing-plans">
                        <div class="plan ${plan === 'monthly' ? 'selected' : ''}" data-plan="monthly">
                            <h3>الخطة الشهرية</h3>
                            <div class="price">${this.premiumConfig.monthlyPrice}$ <span>/شهر</span></div>
                            <ul>
                                <li>وصول لجميع المقالات المميزة</li>
                                <li>الكورسات التدريبية</li>
                                <li>مجتمع الأعضاء الخاص</li>
                                <li>دعم فني مباشر</li>
                            </ul>
                            <button class="subscribe-btn" onclick="monetizationManager.processSubscription('monthly')">
                                اشترك الآن
                            </button>
                        </div>
                        <div class="plan ${plan === 'yearly' ? 'selected' : ''}" data-plan="yearly">
                            <h3>الخطة السنوية</h3>
                            <div class="price">${this.premiumConfig.yearlyPrice}$ <span>/سنة</span></div>
                            <div class="savings">وفر ${(this.premiumConfig.monthlyPrice * 12 - this.premiumConfig.yearlyPrice).toFixed(2)}$</div>
                            <ul>
                                <li>جميع مميزات الخطة الشهرية</li>
                                <li>استشارة شخصية شهرية</li>
                                <li>وصول مبكر للمحتوى الجديد</li>
                                <li>خصومات على الكورسات الإضافية</li>
                            </ul>
                            <button class="subscribe-btn" onclick="monetizationManager.processSubscription('yearly')">
                                اشترك الآن
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        document.body.appendChild(modal);
    }

    processSubscription(plan) {
        // Here you would integrate with payment processors like Stripe, PayPal, etc.
        alert(`سيتم توجيهك لإتمام الدفع للخطة ${plan === 'monthly' ? 'الشهرية' : 'السنوية'}`);
        
        // For demo purposes, simulate successful subscription
        setTimeout(() => {
            localStorage.setItem('userSubscription', JSON.stringify({
                plan: plan,
                startDate: new Date().toISOString(),
                status: 'active'
            }));
            
            alert('تم الاشتراك بنجاح! مرحباً بك في الأعضاء المميزين');
            location.reload();
        }, 2000);
    }

    isUserPremium() {
        const subscription = JSON.parse(localStorage.getItem('userSubscription') || 'null');
        return subscription && subscription.status === 'active';
    }

    checkUserSubscription() {
        const subscription = JSON.parse(localStorage.getItem('userSubscription') || 'null');
        
        if (subscription) {
            const startDate = new Date(subscription.startDate);
            const now = new Date();
            const daysDiff = (now - startDate) / (1000 * 60 * 60 * 24);
            
            // Check if subscription expired
            const maxDays = subscription.plan === 'monthly' ? 30 : 365;
            if (daysDiff > maxDays) {
                localStorage.removeItem('userSubscription');
                this.showSubscriptionExpiredNotice();
            }
        }
    }

    showSubscriptionExpiredNotice() {
        const notice = document.createElement('div');
        notice.innerHTML = `
            <div style="
                background: #ff6b35;
                color: white;
                padding: 1rem;
                text-align: center;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
            ">
                انتهت صلاحية اشتراكك. 
                <button onclick="monetizationManager.showSubscriptionModal()" style="
                    background: white;
                    color: #ff6b35;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    margin-right: 1rem;
                    cursor: pointer;
                ">جدد الآن</button>
                <button onclick="this.parentElement.remove()" style="
                    background: none;
                    color: white;
                    border: 1px solid white;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                ">إغلاق</button>
            </div>
        `;
        document.body.appendChild(notice);
    }

    // Analytics Integration
    initializeAnalytics() {
        this.setupRevenueTracking();
        this.setupConversionTracking();
    }

    setupRevenueTracking() {
        // Track revenue events
        this.revenueEvents = [];
    }

    setupConversionTracking() {
        // Track conversion events
        this.conversionEvents = [];
    }

    sendAnalyticsEvent(eventName, data) {
        // Send to Google Analytics, Facebook Pixel, etc.
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        // Store locally for reporting
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        events.push({
            event: eventName,
            data: data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('analytics_events', JSON.stringify(events.slice(-1000))); // Keep last 1000 events
    }

    // Revenue Reporting
    generateRevenueReport() {
        const affiliateClicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
        const subscriptions = JSON.parse(localStorage.getItem('userSubscription') || 'null');
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');

        return {
            affiliateClicks: affiliateClicks.length,
            estimatedAffiliateRevenue: affiliateClicks.length * 2.5, // Estimated $2.5 per click
            subscriptionRevenue: subscriptions ? (subscriptions.plan === 'monthly' ? this.premiumConfig.monthlyPrice : this.premiumConfig.yearlyPrice) : 0,
            totalEvents: events.length,
            lastUpdated: new Date().toISOString()
        };
    }
}

// Initialize monetization system
document.addEventListener('DOMContentLoaded', () => {
    window.monetizationManager = new MonetizationManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MonetizationManager;
}

