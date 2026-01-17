import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
  // http://localhost:5000/
  // https://shop-aura.onrender.com
});

export default api;
