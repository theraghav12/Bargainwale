import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
  },
  packaging: {
      type: String,
      
  },//
  size:{
    type: String,
  },
  type: {
      type: String,
  },
  weight: {
      type: Number,
      required: true,
  },
  staticPrice: {
      type: Number,
      required: true,
  },
  quantity: {
    type: Number,
    required: true,
},
  
});
const orderSchema = new mongoose.Schema(
  {
    companyBargainDate: {
      type: Date,
      required: true,
    },

    items: [itemSchema], // Array of items
    
    companyBargainNo: {
      type: String,
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    sellerLocation: {
      type: String,
      required: true,
    },
    sellerContact: {
      type: String,
      required: true,
    },
    billType: {
      type: String,
      enum: ["Virtual Billed", "Billed"],
      default: "Virtual Billed",
    },
    status: {
      type: String,
      enum: ["created", "payment pending", "billed", "completed"],
      default: "created",
    },
    description: {
      type: String,
    },
    organization: {
      type: mongoose.Schema.ObjectId,
      ref: "Organization",
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    transportType: {
      type: String,
      required: true,
    },
    transportLocation: {
      type: String,
      required: true,
    },
    paymentDays: {
      type: Number,
      default: 21, // Default payment days
    },
    reminderDays: {
      type: [Number],
      default: [7, 3, 1], // Default reminder days
    },
  },
  { timestamps: true }
);

function daysBetweenDates(date1, date2) {
  const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in a day
  const date1Ms = new Date(date1).getTime();
  const date2Ms = new Date(date2).getTime();

  const differenceMs = Math.abs(date2Ms - date1Ms);
  return Math.floor(differenceMs / oneDay);
}

// Method to calculate days since creation
orderSchema.methods.getDaysSinceCreation = function () {
    const now = new Date();
    const days = Math.ceil((now - this.createdAt) / (1000 * 60 * 60 * 24));
    return days;
};

// Method to calculate days since creation
orderSchema.methods.getDaysSinceCreation = function () {
  return daysBetweenDates(this.createdAt, new Date());
};

// Method to determine if popup should appear
orderSchema.methods.shouldShowPopup = function () {
  const daysSinceCreation = this.getDaysSinceCreation();
  if (this.status === "payment pending") {
    return daysSinceCreation >= 10;
  }
  if (this.status === "created") {
    return daysSinceCreation >= 15;
  }
  return false;
};

const Order = mongoose.model("Order", orderSchema);
export default Order;
