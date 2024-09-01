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
  },
  virtualInventory: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
      quantity: { type: Number, required: true },
      weight: Number,
      itemName: String,
    },
  ],
  billedInventory: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
      quantity: { type: Number, required: true },
      weight: Number,
      itemName: String,
    },
  ],
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
export default Warehouse;
