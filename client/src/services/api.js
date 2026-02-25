import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost';
const API_URL = isProduction ? 'https://collabwithme23.onrender.com/api' : '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers['Authorization'] = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
