import mongoose from "mongoose";

const mailSchema = new mongoose.Schema(
  {
    recipient: {
      email: { type: String, required: true },
      name: { type: String, required: false },
    },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    transactionDetails: {
      transactionType: {
        type: String,
        enum: ["order", "sale", "booking", "purchase"],
        required: true,
      },
      transactionId: { type: mongoose.Schema.ObjectId, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    attempts: { type: Number, default: 0 },
    sentAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

mailSchema.index({ status: 1 });

const Mail = mongoose.model("Mail", mailSchema);

export default Mail;
