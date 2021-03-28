export const tokenHelper = {
    auth: () => {
        let persist = localStorage.getItem('persist:sparql-editor');
        // console.log(persist, 'here');
        if (persist) {
            try {
                let access_token = JSON.parse(JSON.parse(persist).auth).data.data.access_token;
                return access_token;
            } catch {
                return false;
            }
        } else {
            return false;
        }
    },
    get refreshToken() {
        let persist = localStorage.getItem('persist:sparql-editor');
        if (persist) {
            try {
                let refresh_token = JSON.parse(JSON.parse(persist).auth).data.data.refresh_token;
                return refresh_token;
            } catch {
                return false;
            }
        } else {
            return false;
        }
    },
    get isAccessTokenExpired() {
        let persist = localStorage.getItem('persist:sparql-editor');
        if (persist) {
            try {
                let data = JSON.parse(JSON.parse(persist).auth).data.data;
                // console.log(data);
                let expires_in = data.expires_in;

                let token_creation = data.token_creation;
                let date_now = Date.now();

                return (date_now - token_creation) / 1000 + 500 > expires_in;
            } catch (message) {
                console.warn('Catch exception parsing persist:sparql-editor in token expire', message);
                return false;
            }
        } else {
            return false;
        }
    },
};
