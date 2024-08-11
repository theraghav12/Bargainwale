import mongoose from 'mongoose';

const inventoryItemSchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    weightInMetrics: {
        type: Number,
        required: true,
    },
});

const inventorySchema = mongoose.Schema({
    virtualInventory: {
        type: [inventoryItemSchema], 
        required: true,
        default: [],  
    },
    billedInventory: {
        type: [inventoryItemSchema], 
        required: true,
        default: [],  
    },
    warehouseId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Warehouse',
        required: true,
    },
    orderIds: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Order',
        required: true,
    }],
});

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
