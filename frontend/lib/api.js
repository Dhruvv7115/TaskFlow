import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Only force redirect to login if a token exists (user was authenticated)
            // For invalid credentials during login (no token yet), allow the error to propagate
            const token = localStorage.getItem('token');
            if (token) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: async (data) => {
        try {
            const response = await api.post('/auth/register', data);
            return response.data;
        } catch (error) {
            // Normalize register errors so callers get a friendly shape
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    'Unable to complete registration. Please try again.',
            };
        }
    },
    login: async (data) => {
        try {
            const response = await api.post('/auth/login', data);
            return response.data;
        } catch (error) {
            // Normalize login errors so callers get a friendly shape
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    (error.response?.status === 401
                        ? 'Invalid email or password. Please check your credentials.'
                        : 'Unable to complete login. Please try again.'),
            };
        }
    },
};

// User API
export const userAPI = {
    getProfile: async () => {
        try {
            const response = await api.get('/user/profile');
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Unable to fetch profile. Please try again.',
            };
        }
    },
    updateProfile: async (data) => {
        try {
            const response = await api.put('/user/profile', data);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Unable to update profile. Please try again.',
            };
        }
    },
};

// Tasks API
export const tasksAPI = {
    getTasks: async (params) => {
        try {
            const response = await api.get('/tasks', { params });
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Unable to fetch tasks. Please try again.',
            };
        }
    },
    getTask: async (id) => {
        try {
            const response = await api.get(`/tasks/${id}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Unable to fetch task. Please try again.',
            };
        }
    },
    createTask: async (data) => {
        try {
            const response = await api.post('/tasks', data);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Unable to create task. Please try again.',
            };
        }
    },
    updateTask: async (id, data) => {
        try {
            const response = await api.put(`/tasks/${id}`, data);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Unable to update task. Please try again.',
            };
        }
    },
    deleteTask: async (id) => {
        try {
            const response = await api.delete(`/tasks/${id}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Unable to delete task. Please try again.',
            };
        }
    },
};

export default api;