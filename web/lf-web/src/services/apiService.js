import axios from 'axios';

const apiService = axios.create({
  baseURL: 'http://localhost:8000', // replace with your Django API server URL
});

export default apiService;