import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    packaging: {
        type: String,
        enum: ['box', 'tin'],
        default: 'box',
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
const buyerSchema = new mongoose.Schema({
    buyer:{
        type:String,
        required:true,
    },
    buyerLocation: {
        type: String,
        required: true,
    },
    buyerContact: {
        type: String,
        required: true,
    },


})
const bookingSchema = new mongoose.Schema({
    companyBargainDate: {
        type: Date,
        required: true,
    },
    companyBargainNo: {
        type: String,
        required: true,
    },
    buyer:[buyerSchema],
    items: [itemSchema],

    validity:{
        type: String,
        required: true,
    },

      deliveryOption: {
        type: String,
        enum: ["Pickup", "Delivery"],
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
    
    

})