import Inventory from "../models/inventory.js";

const inventoryController = {
    createInventoryItem: async (req, res) => {
        try {
            const inventoryItem = new Inventory(req.body);
            await inventoryItem.save();
            res.status(201).json({ message: 'Inventory item created successfully', inventoryItem });
        } catch (error) {
            res.status(400).json({ message: 'Error creating inventory item', error });
        }
    },
    getAllInventoryItems: async (req, res) => {
        try {
            const inventoryItems = await Inventory.find();
            res.status(200).json(inventoryItems);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving inventory items', error });
        }
    },
    getInventoryItemById: async (req, res) => {
        try {
            const inventoryItem = await Inventory.findById(req.params.id);
            if (!inventoryItem) {
                return res.status(404).json({ message: 'Inventory item not found' });
            }
            res.status(200).json(inventoryItem);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving inventory item', error });
        }
    },
    updateInventoryItem: async (req, res) => {
        try {
            const inventoryItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!inventoryItem) {
                return res.status(404).json({ message: 'Inventory item not found' });
            }
            res.status(200).json({ message: 'Inventory item updated successfully', inventoryItem });
        } catch (error) {
            res.status(400).json({ message: 'Error updating inventory item', error });
        }
    },
    deleteInventoryItem: async (req, res) => {
        try {
            const inventoryItem = await Inventory.findByIdAndDelete(req.params.id);
            if (!inventoryItem) {
                return res.status(404).json({ message: 'Inventory item not found' });
            }
            res.status(200).json({ message: 'Inventory item deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting inventory item', error });
        }
    }
};

export default inventoryController;