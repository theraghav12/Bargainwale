import axios from "axios";
import { API_BASE_URL } from "./api";

const orgId = localStorage.getItem("organizationId");

export const getItems = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${orgId}/items`);
        return response.data;
    } catch (error) {
        console.error("Error fetching prices:", error);
        throw error;
    }
};

export const getPricesByWarehouse = async (warehouseId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${orgId}/warehouseprices/${warehouseId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching prices:", error);
        throw error;
    }
};

export const getPrices = async (warehouseId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${orgId}/prices`);
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