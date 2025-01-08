import mongoose from "mongoose";

const orgSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        clerkOrganizationId: {
            type: String,
        },
        creatorId: {
            type: String,
        },
        users: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            line1: {
                type: String,
                required: true,
            },
            line2: {
                type: String,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            pincode: {
                type: String,
            },
        },
        gstin: {
            type: String,
            required: true,
        },
        fssai: {
            type: String,
        },
    },
    { timestamps: true }
);

const Organization = mongoose.model("Organization", orgSchema);
export default Organization;
