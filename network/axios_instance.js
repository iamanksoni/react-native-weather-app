import axios from 'react-native-axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.weatherapi.com/',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
  },
});

export default axiosInstance;
