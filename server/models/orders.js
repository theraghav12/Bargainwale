import mongoose from "mongoose";
import Inventory from "./inventory.js";

const orderSchema = new mongoose.Schema({
    companyBargainDate: {
        type: Date,
        required: true,
    },
    currentDate: {
        type: Date,
        default: Date.now,
    },
    item: {
        type: {
            type: String,
            required: true,
        },
        packaging: {
            type: String,
            enum: ['box', 'tin'],
            required: function () { return this.type === 'box'; },
        },
        oilType: {
            type: String,
            required: true,
        },
        weight:{
            type: Number,
            required:true,
        },
    
    },
    companyBargainNo: {
        type: String,
        required: true,
    },
    location: {
        state: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
    },
    staticPrice: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    weightInMetrics: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['virtual billed', 'billed'],
        default: 'virtual billed',
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    billedAt: {
        type: Date,
    },
    organization: {
        type: mongoose.Schema.ObjectId,
        ref: 'Organization',
        required: true,
    },
    TransportLocation:{
        state: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        
    },
    TransportType:{
        type: String,
        required:true,
    },
});

// Method to calculate days since creation
orderSchema.methods.getDaysSinceCreation = function () {
    const now = new Date();
    const days = Math.ceil((now - this.createdAt) / (1000 * 60 * 60 * 24));
    return days;
};

// Method to determine if popup should appear
orderSchema.methods.shouldShowPopup = function () {
    const daysSinceCreation = this.getDaysSinceCreation();
    if (this.status === 'created') {
        return daysSinceCreation >= 10;
    }
    if (this.status === 'billed' && this.status === 'payment pending') {
        return daysSinceCreation >= 15;
    }
    return false;
};

orderSchema.post('save', async function (doc, next) {
    try {
        const { item, quantity, weightInMetrics, organization } = doc;

        let inventoryItem = await Inventory.findOne({
            'item.type': item.type,
            'item.category': item.category,
            'item.oilType': item.oilType,
            organization
        });

        if (inventoryItem) {
            inventoryItem.quantity += quantity;
            inventoryItem.weightInMetrics += weightInMetrics;
            await inventoryItem.save();
        } else {
            inventoryItem = new Inventory({
                item,
                quantity,
                weightInMetrics,
                organization
            });
            await inventoryItem.save();
        }
        next();
    } catch (err) {
        next(err);
    }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;