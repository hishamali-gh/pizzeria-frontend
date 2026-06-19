import axios from "axios";

import Cookies from "js-cookie";


const getBaseURL = () => {
    const { hostname, protocol } = window.location

    // If running locally, keep using the local setup on port 8000
    if (hostname === 'localhost' || hostname.endsWith('localhost')) {
        return `${protocol}//${hostname}:8000/`;
    }

    // If running on Vercel:
    const parts = hostname.split('.');
    const isVercel = hostname.endsWith('.vercel.app');

    // If it has a tenant subdomain
    if ((isVercel && parts.length > 3) || (!isVercel && parts.length > 2)) {
        const tenant = parts[0];

        return `https://${tenant}.pizzeriavdcs.duckdns.org/`;
    }

    // Default to the main public EC2 API endpoint (using 'api.' prefix to match wildcard certificate)
    return `https://api.pizzeriavdcs.duckdns.org/`;
}

const API = axios.create({
    baseURL: getBaseURL()
});

API.interceptors.request.use(config => {
    const token = localStorage.getItem('access');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

API.interceptors.response.use(response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh');

                const res = await axios.post(`${getBaseURL()}auth/token/refresh/`, {
                    refresh: refreshToken
                });

                const newAccess = res.data.access;

                localStorage.setItem('access', newAccess);

                originalRequest.headers.Authorization = `Bearer ${newAccess}`;

                return axios(originalRequest);
            }
            
            catch (refreshError) {
                console.error("Master session expired. Redirecting to Lobby.");

                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default API;
