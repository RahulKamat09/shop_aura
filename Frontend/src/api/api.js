import axios from 'axios';

const api = axios.create({
  baseURL: 'https://shop-aura.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
  // http://localhost:5000/
  // https://shop-aura.onrender.com
});

export default api;
