import Order from "../models/orders.js";
import axios from 'axios'

const orderController = {
    createOrder: async (req, res) => {
        try {
            const { name, packaging, type ,weight, quantity, staticPrice, companyBargainNo, state, city, billType, status, description, organization, warehouse, transportLocation, transportType} = req.body;
            console.log(req.body);
            const order = new Order({
                item:{
                    name,
                    packaging,
                    type,
                    weight,
                    staticPrice,
                    quantity
                },
                companyBargainNo,
                sellerName,
                sellerLocation,
                sellerContact,
                billType,
                status,
                description,
                organization,
                warehouse,
                transportLocation,
                transportType,  
            });
            await order.save();
            res.status(201).json({ message: 'Order created successfully', order });
        } catch (error) {
            console.log(error)  
            res.status(400).json({ message: 'Error creating order', error });
        }
    },
    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.find();
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving orders', error });
        }
    },
    getOrderById: async (req, res) => {
        try {
            const order = await Order.find({ organization: req.params.id });
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving order', error });
        }
    },
    updateOrder: async (req, res) => {
        try {
            const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json({ message: 'Order updated successfully', order });
        } catch (error) {
            res.status(400).json({ message: 'Error updating order', error });
        }
    },
    deleteOrder: async (req, res) => {
        try {
            const order = await Order.findByIdAndDelete(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json({ message: 'Order deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting order', error });
        }
    }
};

export default orderController;