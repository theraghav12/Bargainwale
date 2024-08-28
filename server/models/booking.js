import mongoose from "mongoose";
import buyerSchema from './buyer.js';

const itemSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
  },
  //item id
  packaging: {
      type: String,
      
  },//size of box
  size:{
    type: String,
  },
  type: {
      type: String,
  },
  weight: {
      type: Number,   
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
const bookingSchema = new mongoose.Schema(
  {
    companyBargainDate: {
      type: Date,
      required: true,
    },
    companyBargainNo: {
      type: String,
      required: true,
    },
    buyer: buyerSchema,
    items: [itemSchema],

    validity: {
      type: Number,
      default: 21, // Default payment days
    },

    deliveryOption: {
      type: String,
      enum: ["Pickup", "Delivery"],
      //for
      //exw
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.ObjectId,
      ref: "Warehouse",
      required: function () {
        return this.deliveryOption === "Pickup";
      },
    },
    deliveryAddress: {
      addressLine1: {
        type: String,
        required: function () {
          return this.deliveryOption === "Delivery";
        },
      },
      addressLine2: {
        type: String,
      },
      city: {
        type: String,
        required: function () {
          return this.deliveryOption === "Delivery";
        },
      },
      state: {
        type: String,
        required: function () {
          return this.deliveryOption === "Delivery";
        },
      },
      pinCode: {
        type: String,
        required: function () {
          return this.deliveryOption === "Delivery";
        },
      },

    },
    virtualInventoryQuantities: [
      {
        itemName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    billedInventoryQuantities: [
      {
        itemName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["created", "payment pending", "billed", "completed"],
      default: "created",
    },
    reminderDays: {
      type: [Number],
      default: [7, 3, 1], // Default reminder days
    },
  },
  { timestamps: true }
);

    // Create and export the model
    const Booking = mongoose.model('Booking', bookingSchema);
    export default Booking;
    
    

