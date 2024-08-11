import mongoose from "mongoose";

const warehouseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
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
    inventory: {
        type: mongoose.Schema.ObjectId,
        ref: 'Inventory',
        required: true,
    },
    organization: {
        type: mongoose.Schema.ObjectId,
        ref: "Organization"
    }
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
export default Warehouse;