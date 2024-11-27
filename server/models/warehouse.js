import mongoose from "mongoose";

const warehouseSchema = mongoose.Schema({
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
    type: String,
    required: true,
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
}, { timestamps: true });

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
export default Warehouse;
