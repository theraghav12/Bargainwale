const transportSchema = new mongoose.Schema({
    transport:{
        type:String,
        required:true,
    },
    transportType:{
        type:String,
        required:true,
    },
    transportContact: {
        type: String,
        required: true,
    },
    transportAgency:{
        
    },
})
