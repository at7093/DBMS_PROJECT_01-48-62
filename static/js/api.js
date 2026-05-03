const API_BASE = '/api';

const api = {
    getToken() {
        return localStorage.getItem('token');
    },

    setToken(token) {
        localStorage.setItem('token', token);
    },

    clearToken() {
        localStorage.removeItem('token');
    },

    async request(endpoint, method = 'GET', body = null) {
        const headers = {
            'Content-Type': 'application/json'
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method,
            headers
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    },

    login(username, password) {
        return this.request('/auth/login', 'POST', { username, password });
    },

    signup(username, password, role) {
        return this.request('/auth/signup', 'POST', { username, password, role });
    },

    getMe() {
        return this.request('/auth/me');
    },

    addFunds(amount) {
        return this.request('/user/add-funds', 'POST', { amount });
    },

    getProducts() {
        return this.request('/products');
    },

    getTransactions() {
        return this.request('/transactions');
    },

    buyProduct(productId) {
        return this.request('/transaction/buy', 'POST', { product_id: productId });
    },

    dispatchProduct(transactionId) {
        return this.request(`/transaction/${transactionId}/dispatch`, 'POST');
    },

    acceptDelivery(transactionId) {
        return this.request(`/transaction/${transactionId}/accept`, 'POST');
    },

    confirmDelivery(transactionId) {
        return this.request(`/transaction/${transactionId}/confirm-delivery`, 'POST');
    },

    cancelDelivery(transactionId) {
        return this.request(`/transaction/${transactionId}/cancel-delivery`, 'POST');
    },

    confirmReturn(transactionId) {
        return this.request(`/transaction/${transactionId}/confirm-return`, 'POST');
    }
};
