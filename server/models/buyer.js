const buyerSchema = new mongoose.Schema({
    buyer:{
        type:String,
        required:true,
    },
    buyerCompany:{

    },
    BuyerdeliveryAddress: {
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
    buyerContact: {
        type: String,
        required: true,
    },
    buyerEmail:{

    },
    buyerGstno:{

    },
    buyerGooglemaps:{

    }
    


});