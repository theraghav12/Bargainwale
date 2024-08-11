import mongoose from "mongoose";

const orgSchema = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    users: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
});

const Organization = mongoose.model("Organizations", orgSchema);
export default Organization;