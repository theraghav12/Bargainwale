import mongoose from "mongoose";

const warehouseSchema = mongoose.Schema(
  {
    name: {
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
    organization: {
      type: mongoose.Schema.ObjectId,
      ref: "Organization",
    },
    warehouseManager: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please fill a valid email address",
        ],
      },
    },
    virtualInventory: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
        quantity: { type: Number },
        pickup: {
          type: String,
          enum: ["rack", "depot", "plant"],
          default: "rack",
        },
      },
    ],
    billedInventory: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
        quantity: { type: Number },
      },
    ],
    soldInventory: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
        pickup: {
          type: String,
          enum: ["rack", "depot", "plant"],
          default: "rack",
        },
        virtualQuantity: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
export default Warehouse;
