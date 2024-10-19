import mongoose from 'mongoose';

const totalSaleSchema = new mongoose.Schema({
  sales: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  totalAmount:{
    type:Number,
    required:true,
  }
});

const TotalSale = mongoose.model('TotalSale', totalSaleSchema);

export default TotalSale;
