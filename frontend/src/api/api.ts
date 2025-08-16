import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_BACKEND,
    headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",

    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
        localStorage.removeItem("token");
        window.location.href = "/";
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
)

export default api;