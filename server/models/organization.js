import mongoose from "mongoose";

const orgSchema = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String
    },
    users: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    branches:{
        type:mongoose.Schema.ObjectId,

    }
});

const Organization = mongoose.model("Organizations", orgSchema);
export default Organization;