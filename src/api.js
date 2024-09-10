import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.ipnordic.dk/statistics/v1/',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
  },
});

export const fetchApiData = async (endpoint, params = {}) => {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};