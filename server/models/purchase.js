import mongoose from "mongoose";
import crypto from "crypto";

const purchasedItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Item", // Assuming you have an Item model
  },
  quantity: {
    type: Number,
    required: true,
  },
  pickup: {
    type: String,
    enum: ["rack", "depot", "plant"],
    default: "rack",
  },
});

const purchaseSchema = new mongoose.Schema(
  {
    warehouseId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Warehouse",
    },
    transporterId: {
      type: mongoose.Schema.ObjectId,
      ref: "Transport",
    },
    orderId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Order",
    },
    invoiceNumber: {
      type: String,
      unique: true,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    items: [purchasedItemSchema],
    organization: {
      type: mongoose.Schema.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  { timestamps: true }
);

purchaseSchema.pre("save", function (next) {
  const randomString = crypto.randomBytes(4).toString("hex");

  this.invoiceNumber = `${Date.now() + 5.5 * 60 * 60 * 1000}-${this.orderId
    }-${randomString}`;

  next();
});

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
