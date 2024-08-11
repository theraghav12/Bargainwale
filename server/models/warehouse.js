import mongoose from "mongoose";

const warehouseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
    },
    inventoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Inventory',
        required: true,
    }
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
export default Warehouse;