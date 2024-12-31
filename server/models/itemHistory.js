import mongoose from "mongoose";

const itemHistorySchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    pickup: {
        type: String,
    },
    sourceModel: {
        type: String,
        required: true,
        enum: ["Manufacturer", "Order", "Warehouse", "Booking"]
    },
    source: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "sourceModel"
    },
    destinationModel: {
        type: String,
        required: true,
        enum: ["Warehouse", "Buyer"]
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "destinationModel"
    },
    quantity: {
        type: Number,
        required: true
    },
    organization: {
        type: mongoose.Schema.ObjectId,
        ref: "Organization",
        required: true,
    },
    inventoryType: {
        type: String
    }
}, { timestamps: true });

const ItemHistory = mongoose.model("ItemHistory", itemHistorySchema);
export default ItemHistory;