const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
    ORDERS: `${API_BASE_URL}/orders`,
    CREATE_ORDER: `${API_BASE_URL}/orders/create`,
    USER: `${API_BASE_URL}/user`,
    WALLET_BALANCE: `${API_BASE_URL}/subscription/balance`,
    TOPUP: `${API_BASE_URL}/subscription/topup`,
    HEALTH: `${API_BASE_URL}/health`,
    RESTAURANTS: `${API_BASE_URL}/restaurants`,
    GROCERIES: `${API_BASE_URL}/groceries/shops`,
};

export default API_BASE_URL;
