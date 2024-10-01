import axios from "axios";
import { API_BASE_URL } from "./api";

export const getItems = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/items`);
        return response.data;
    } catch (error) {
        console.error("Error fetching prices:", error);
        throw error;
    }
};

export const getPricesByWarehouse = async (warehouseId, date) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/warehouseprices/${warehouseId}?date=${date}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching prices:", error);
        throw error;
    }
};

export const getPrices = async (warehouseId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/warehouseprices/${warehouseId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching prices:", error);
        throw error;
    }
};

export const addPrice = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/add`, data);
        return response.data;
    } catch (error) {
        console.error("Error adding prices:", error);
        throw error;
    }
};
