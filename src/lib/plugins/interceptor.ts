import axios from 'axios';

// Create an instance of axios with the base URL
const apiClient = axios.create({
    baseURL: 'https://softgenie.org/api/',
    timeout: 10000, // Optional: Set a timeout for requests
});

export default apiClient;