import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export async function addSale(saleData) {
  try {
    const response = await axios.post(`${BASE_URL}/Sale`, saleData);
    return response.data;
  } catch (error) {
    console.error('Error adding sale:', error);
    throw error;
  }
}
