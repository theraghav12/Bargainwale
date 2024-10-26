import mongoose from "mongoose";

const itemHistorySchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    sourceModel: {
        type: String,
        required: true,
        enum: ["Manufacturer", "Order", "Warehouse"]
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
}, { timestamps: true });

const ItemHistory = mongoose.model("ItemHistory", itemHistorySchema);
export default ItemHistory;