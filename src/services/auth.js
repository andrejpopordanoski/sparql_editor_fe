const PERSIST_KEY = 'persist:sparql-editor';

const authService = {
    _user: null,

    get user() {
        const persist = localStorage.getItem(PERSIST_KEY);
        try {
            const data = JSON.parse(persist);
            const auth = JSON.parse(data.auth);
            return auth.data.user;
        } catch (error) {
            return null;
        }
    },

    get token() {
        const persist = localStorage.getItem(PERSIST_KEY);
        try {
            const data = JSON.parse(persist);
            const auth = JSON.parse(data.auth);

            return auth.data.accessToken;
        } catch (error) {
            return null;
        }
    },

    get providerId() {
        const persist = localStorage.getItem(PERSIST_KEY);
        try {
            const data = JSON.parse(persist);
            const auth = JSON.parse(data.auth);
            return auth.data.providerId;
        } catch (error) {
            return null;
        }
    },

    get authDomain() {
        const baseDomain = process.env.REACT_APP_BASE_DOMAIN;
        const tenant = window.location.hostname.replace(baseDomain, '');
        // reserve www
        if (!tenant || tenant === 'www') {
            return '';
        }
        // remove ending '.' from subdomain
        return tenant.slice(0, -1);
    },

    getLoginRedirectUrl(domain) {
        const { port, protocol } = window.location;
        const host = `${protocol}//${domain}.${process.env.REACT_APP_BASE_DOMAIN}${port && `:${port}`}`;
        return `${host}/login`;
    },

    getSignUpUrl() {
        const { port, protocol } = window.location;
        const host = `${protocol}//${process.env.REACT_APP_BASE_DOMAIN}${port && `:${port}`}`;
        return `${host}/sign-up`;
    },
};

export { authService };
