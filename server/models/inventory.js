import mongoose from 'mongoose';

const inventorySchema = mongoose.Schema({
    item: {
        type: {
            type: String,
            enum: ['oil', 'box', 'tin'],
            required: true,
        },
        category: {
            type: String,
            enum: ['box', 'tin'],
            required: function () { return this.type === 'box'; },
        },
        oilType: {
            type: String,
            enum: ['palmOil', 'vanaspatiOil', 'soybeanOil'],
            required: function () { return this.type === 'oil'; },
        },
    },
    quantity: {
        type: Number,
        required: true,
    },
    weightInMetrics: {
        type: Number,
        required: true,
    },
    convertedWeightInGm: {
        type: Number,
        required: true,
    },
    organization: {
        type: mongoose.Schema.ObjectId,
        ref: 'Organization',
        required: true,
    },
});

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;