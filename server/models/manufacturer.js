const sellerSchema = new mongoose.Schema({
    seller:{
        //catigory
        type:String,
        required:true,
    },
    sellerLocation: {
        type: String,
        required: true,
    },
    sellerContact: {
        type: String,
        required: true,
    },
})