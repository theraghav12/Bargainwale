import mongoose from "mongoose";
import crypto from "crypto";

const soldItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Item",
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

const saleSchema = new mongoose.Schema(
  {
    warehouseId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Warehouse",
    },

    bookingId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Booking",
    },

    items: [soldItemSchema],
    organization: {
      type: mongoose.Schema.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  { timestamps: true }
);

saleSchema.pre("save", function (next) {
  const randomString = crypto.randomBytes(4).toString("hex");

  this.invoiceNumber = `${Date.now() + 5.5 * 60 * 60 * 1000}-${this.bookingId
    }-${randomString}`;

  next();
});

const Sale = mongoose.model("Sale", saleSchema);
export default Sale;