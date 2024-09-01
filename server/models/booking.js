import mongoose from "mongoose";



const bookingSchema = new mongoose.Schema(
  {
    BargainDate: {
      type: Date,
      required: true,
    },
    BargainNo: {
      type: String,
      required: true,
    },
    items: [{
      item: { type: mongoose.Schema.ObjectId, ref: "Item", required: true },
      quantity: { type: Number, required: true }
    }],
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
        return this.deliveryOption === "Pickup" || "Delivery";
      },
    },
    organization: {
      type: mongoose.Schema.ObjectId,
      ref: "Organization",
      required: true,
    },

    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: "Buyer",  // Reference to Manufacturer schema
      required: true,
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
    status: {
      type: String,
      enum: ["created", "payment pending", "billed", "completed"],
      default: "created",
    },
    reminderDays: {
      type: [Number],
      default: [7, 3, 1], // Default reminder days
    },
    validity: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
    },
  },
  { timestamps: true }
);

    // Create and export the model
    const Booking = mongoose.model('Booking', bookingSchema);
    export default Booking;
    
    

