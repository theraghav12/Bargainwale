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
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
      quantity: { type: Number },
      weight: Number,
      itemName: String,
    },
  ],
  billedInventory: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
      quantity: { type: Number },
      weight: Number,
      itemName: String,
    },
  ],
  soldInventory: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
      billedQuantity: { type: Number, default: 0 }, 
      virtualQuantity: { type: Number, default: 0 }, 
    },
  ],
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
export default Warehouse;
