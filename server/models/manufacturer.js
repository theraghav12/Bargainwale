import mongoose from "mongoose";

const manufacturerSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    required: true,
  },
  manufacturerCompany: {
    type: String,
    required: true,

  },
  manufacturerdeliveryAddress: {
    addressLine1: {
      type: String,
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pinCode: {
      type: String,
    },
  },
  manufacturerContact: {
    type: String,
    required: true,
  },
  manufacturerEmail: {
    type: String,
    required: true,
  },
  manufacturerGstno: {
    type: String,
    required: true,
  },
  manufacturerGooglemaps: {
    type: String,
  },
  organization: {
    type: mongoose.Schema.ObjectId,
    ref: "Organization",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });
const Manufacturer = mongoose.model('Manufacturer', manufacturerSchema);
export default Manufacturer;
