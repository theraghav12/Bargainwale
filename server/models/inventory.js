import mongoose from 'mongoose';

const inventoryItemSchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    quantity: {
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
    warehouse: {
        type: mongoose.Schema.ObjectId,
        ref: 'Warehouse',
        required: true,
    },
});

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
