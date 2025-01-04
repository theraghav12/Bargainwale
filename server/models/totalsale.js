import mongoose from 'mongoose';

const totalSaleSchema = new mongoose.Schema({
  sales: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
  }],
  invoiceNumber: {
    type: String,
    unique: true,
  },
  invoiceDate: {
    type: Date,
    default: Date.now,
  },
  transporterId: {
    type: mongoose.Schema.ObjectId,
    ref: "Transport",
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  }
},
  { timestamps: true }
);

const TotalSale = mongoose.model('TotalSale', totalSaleSchema);

export default TotalSale;
