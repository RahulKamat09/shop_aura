import axios from 'axios';

const api = axios.create({
  baseURL: 'https://shopaura-production.up.railway.app',
  headers: {
    'Content-Type': 'application/json'
  }
  // http://localhost:5000
  // https://shop-aura.onrender.com
  //https://shopaura-production.up.railway.app/
});

export default api;