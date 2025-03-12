import axiosClient from '../../lib/api/axiosClient';

export const authApi = {
  login: (email: string, password: string) => {
    return axiosClient.post('/auth/login', { email, password });
  },
  
  register: (userData: { name: string; email: string; password: string }) => {
    return axiosClient.post('/auth/register', userData);
  },
  
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  
  getCurrentUser: () => {
    return axiosClient.get('/auth/me');
  },
};