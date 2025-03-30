import axios from 'axios';

// Create an instance of axios with the base URL
const apiClient = axios.create({
    baseURL: 'https://softgenie.org/api/',
});

export default apiClient;