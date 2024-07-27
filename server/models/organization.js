import mongoose from "mongoose";

const orgSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    users: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    orders: {
        type: mongoose.Schema.ObjectId,
        ref: "Order"
    },
    inventory: {
        type: mongoose.Schema.ObjectId,
        ref: "Inventory"
    },
});

const Organization = mongoose.model("Organizations", orgSchema);
export default Organization;