const ADS = {
    init: () => {
        ADS.loadGoogleAds();
        ADS.loadAffiliateBanners();
        ADS.injectNativeAds();
    },

    loadGoogleAds: () => {
        // Simulate loading Google AdSense script
        console.log('Loading Google AdSense...');
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_ID';
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);

        // Simulate ad placement
        setTimeout(() => {
            const adSlots = document.querySelectorAll('.ad-slot');
            adSlots.forEach(slot => {
                slot.innerHTML = '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-YOUR_ADSENSE_ID" data-ad-slot="YOUR_AD_SLOT_ID" data-ad-format="auto" data-full-width-responsive="true"></ins>';
                (adsbygoogle = window.adsbygoogle || []).push({});
                console.log('AdSense ad injected into slot:', slot);
            });
        }, 1000);
    },

    loadAffiliateBanners: () => {
        console.log('Loading affiliate banners...');
        const affiliateSlots = document.querySelectorAll('.affiliate-slot');
        affiliateSlots.forEach(slot => {
            const banner = document.createElement('a');
            banner.href = 'https://your-affiliate-link.com/product-x'; // Replace with actual affiliate link
            banner.target = '_blank';
            banner.innerHTML = '<img src="images/affiliate-banner.jpg" alt="Affiliate Product" style="width:100%; height:auto;">';
            slot.appendChild(banner);
            console.log('Affiliate banner injected into slot:', slot);
        });
    },

    injectNativeAds: () => {
        console.log('Injecting native ads...');
        const articleContent = document.querySelector('.article-content'); // Assuming articles have this class
        if (articleContent) {
            const paragraphs = articleContent.querySelectorAll('p');
            if (paragraphs.length > 2) {
                const nativeAd = document.createElement('div');
                nativeAd.className = 'native-ad';
                nativeAd.innerHTML = `
                    <h3>محتوى ممول</h3>
                    <p>اكتشف أفضل الأدوات لزيادة إنتاجيتك في ريادة الأعمال. <a href="https://your-sponsored-link.com/tool-y" target="_blank">تعرف عليها الآن!</a></p>
                `;
                paragraphs[1].insertAdjacentElement('afterend', nativeAd);
                console.log('Native ad injected into article content.');
            }
        }
    }
};

// Initialize ads when the DOM is ready
document.addEventListener('DOMContentLoaded', ADS.init);

