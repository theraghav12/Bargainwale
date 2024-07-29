import mongoose from 'mongoose';

const inventorySchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    itemNumber: {
        type: String,
        required: true,
        unique: true,
    },
    itemDetails: {
        weightPerItem: {
            type: Number,
            required: true,
        },
        categories: [{
            type: String,
            enum: ['box', 'tin'],
            required: true,
        }],
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
});

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;