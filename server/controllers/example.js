const {StatusCodes}= require('http-status-codes');

const {BookingService}= require('../services/index');
const {createChannel, publishMessage}=require('../utils/messageQueue');
const {REMINDER_BINDING_KEY}=require('../config/serverConfig');

const bookingService=new BookingService();

class BookingController{

    constructor(){
        
    }

    async sendMessageToQueue(req,res){
        const channel=await createChannel();
        const payload={
            data:{
                subject:"This is a notification from queue",
                content:"Some queue will subscribe to this",
                recepientEmail: "amrutanshjha2010@gmail.com",
                notificationTime: "2024-08-03T23:00:00"
            },
            service: 'CREATE_TICKET',
        };
        publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(payload));
        return res.status(200).json({
            message:'Successfully published the event'
        });
    }

    async create (req,res){
    try {
        const response=await bookingService.createBooking(req.body);
        return res.status(StatusCodes.OK).json({
            data:response,
            message:'Successfully completed booking',
            success:true,
            error:{},
        });
    } catch (error) {
        return res.status(error.statusCodes).json({
            data:{},
            message:error.message,
            success:false,
            error:error.explanation,
        });
    }
}

}

module.exports= BookingController