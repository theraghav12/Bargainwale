import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema({
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  companyPrice: { type: Number, required: true },
  rackPrice: { type: Number, required: true },
  plantPrice: { type: Number, required: true },
  depoPrice: { type: Number, required: true },
  effectiveDate: { type: Date, default: Date.now }, 
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
}, { timestamps: true });

const PriceHistory = mongoose.model("PriceHistory", priceHistorySchema);
export default PriceHistory;
