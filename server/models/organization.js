import mongoose from "mongoose";

const orgSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    clerkOrganizationId: {
        type: String
    },
    creatorId: {
        type: String
    },
    users: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
}, { timestamps: true });

const Organization = mongoose.model("Organizations", orgSchema);
export default Organization;