import mongoose from "mongoose";


const orderSchema = new mongoose.Schema(
  {
    companyBargainDate: {
      type: Date,
      required: true,
    },

    companyBargainNo: {
      type: String,
      required: true,
    },
    items: [{
      item: { type: mongoose.Schema.ObjectId, ref: "Item", required: true },
      quantity: { type: Number, required: true },
      pickup: {
        type: String,
        enum: ["rack", "depot", "plant"],
        default: "rack",
      },
      baseRate:{
        type:Number,
      },
      taxpaidAmount:{
        type:Number,
      },
      contNumber:{
        type:Number,
      }, 

    }],
    
   totalAmount:{
    type: Number,
    
   },
    inco:{
      type:String,
      enum:["EXW","FOR"],
    },
    billType: {
      type: String,
      enum: ["Virtual Billed", "Billed"],
      default: "Virtual Billed",
    },
    status: {
      type: String,
      enum: ["created", "partially paid", "billed"],
      default: "created",
    },
    
    organization: {
      type: mongoose.Schema.ObjectId,
      ref: "Organization",
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.ObjectId,
      ref: "Warehouse",  // Reference to Warehouse schema
      required: true,
    },
    manufacturer: {
      type: mongoose.Schema.ObjectId,
      ref: "Manufacturer",  // Reference to Manufacturer schema
      required: true,
    },
    transportCatigory: {
      type: String,
      required: true,
      //depo
    },
    
    paymentDays: {
      type: Number,
      default: 21, // Default payment days
    },
    reminderDays: {
      type: [Number],
      default: [7, 3, 1], // Default reminder days
    },
    description: {
      type: String,
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
