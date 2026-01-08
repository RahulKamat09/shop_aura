import axios from 'axios';

const api = axios.create({
  baseURL: 'https://shop-aura.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
