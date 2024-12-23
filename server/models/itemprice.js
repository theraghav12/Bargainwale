import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true
  },
  companyPrice: {
    type: Number,
    required: true
  },
  rackPrice: {
    type: Number,
    required: true
  },
  plantPrice: {
    type: Number,
    required: true
  },
  depotPrice: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  pricesUpdated: {
    type: Boolean,
    default: false
  },
  organization: {
    type: mongoose.Schema.ObjectId,
    ref: "Organization",
    required: true,
  },
}, { timestamps: true });

const Price = mongoose.model("Price", priceSchema);
export default Price;
