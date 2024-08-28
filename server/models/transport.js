import mongoose from "mongoose";
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
        type:String,
        required:true,
        
    },
});
const Transport = mongoose.model('Transport', transportSchema);
    export default Transport;
    