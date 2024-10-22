import axios from "axios";
import { API_BASE_URL } from "./api";

const orgId = localStorage.getItem("organizationId");

export const getBookings = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${orgId}/booking`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const createBooking = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/booking`, data);
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const deleteBooking = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/booking/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};