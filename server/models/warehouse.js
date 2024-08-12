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
  virtualInventory: {
    type: [
      {
        itemName: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
    default: [],
  },
  billedInventory: {
    type: [
      {
        itemName: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
    default: [],
  },
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
export default Warehouse;