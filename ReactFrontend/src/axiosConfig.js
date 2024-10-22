import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // FastAPI base URL
});

// Interceptors
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Handle token expiration
            alert("Your session has expired. Please log in again.");
            // Redirect to the login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;