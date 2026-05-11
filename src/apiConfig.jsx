import axios from "axios";

import Cookies from "js-cookie";


const getBaseURL = () => {
    const { hostname, protocol } = window.location

    return `${protocol}//${hostname.split(':')[0]}:8000/`;
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

                window.location.href = "http://localhost:5173/login";

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default API;
