import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true,
    },
    itemNo: {
        type: String,
        unique: true,
        default: function () {
            return `ITEM-${Math.floor(Math.random() * 1000000)}`;
        },
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
});

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;