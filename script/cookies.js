(() => {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const panel = document.getElementById('cookie-panel');
    const analyticsToggle = document.getElementById('cookie-analytics');
    const KEY = 'qco_cookie_consent';

    const readConsent = () => {
        try {
            const raw = localStorage.getItem(KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (err) {
            return null;
        }
    };

    const writeConsent = (analytics) => {
        const payload = {
            necessary: true,
            analytics: !!analytics,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(KEY, JSON.stringify(payload));
        return payload;
    };

    const applyConsent = (consent) => {
        document.documentElement.dataset.cookieAnalytics = consent.analytics ? 'true' : 'false';
        banner.setAttribute('hidden', '');
        banner.setAttribute('aria-hidden', 'true');
    };

    const openPanel = () => {
        if (!panel) return;
        const existing = readConsent();
        if (analyticsToggle) analyticsToggle.checked = !!(existing && existing.analytics);
        panel.removeAttribute('hidden');
        panel.setAttribute('aria-hidden', 'false');
    };

    const closePanel = () => {
        if (!panel) return;
        panel.setAttribute('hidden', '');
        panel.setAttribute('aria-hidden', 'true');
    };

    const existing = readConsent();
    if (existing) {
        applyConsent(existing);
    }

    banner.addEventListener('click', (event) => {
        const target = event.target.closest('[data-cookie-action]');
        if (!target) return;
        const action = target.dataset.cookieAction;
        if (action === 'accept') {
            applyConsent(writeConsent(true));
            closePanel();
        }
        if (action === 'reject') {
            applyConsent(writeConsent(false));
            closePanel();
        }
        if (action === 'settings') {
            openPanel();
        }
    });

    if (panel) {
        panel.addEventListener('click', (event) => {
            const closeTarget = event.target.closest('[data-cookie-close]');
            if (closeTarget) {
                closePanel();
                return;
            }
            const saveTarget = event.target.closest('[data-cookie-save]');
            if (saveTarget) {
                const analytics = analyticsToggle ? analyticsToggle.checked : false;
                applyConsent(writeConsent(analytics));
                closePanel();
            }
        });
    }
})();
