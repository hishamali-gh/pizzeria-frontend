import axios from "axios";


const getBaseURL = () => {
    const { hostname, protocol } = window.location

    if (hostname === 'localost' || hostname === '127.0.0.1'){
        return `${protocol}//127.0.0.1:8000/`;
    }

    return `${protocol}//${hostname}:8000/`;
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

export default API;
