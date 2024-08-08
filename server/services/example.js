const axios=require('axios'); 

const {BookingRepository}= require('../repository/index');
const {FLIGHT_SERVICE_PATH}=require('../config/serverConfig');
const { ServiceError } = require('../utils/errors');

class BookingService{
    constructor(){
        this.bookingRepository=new BookingRepository();
    }

    async createBooking(data){ //flightId, userId, noOfSeats
        try {
            const flightId=data.flightId; //we need to get data from flight service using this flightId (like price, name etc.)
            const getFlightRequestURL=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`
            const response=await axios.get(getFlightRequestURL);
            const flightData= response.data.data;
            const priceOfTheFlight = flightData.price;
            if(data.noOfSeats>flightData.totalSeats){
                throw new ServiceError('Something went wrong in the booking process', 'Insufficient seats');
            }
            const totalCost= priceOfTheFlight*data.noOfSeats;
            console.log("Data",data);
            const bookingPayload={...data,totalCost};
            console.log("Payload",bookingPayload);
            const booking= await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestURL=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL, {totalSeats:flightData.totalSeats-data.noOfSeats});
            const finalBooking=await this.bookingRepository.update(booking.id,{status:'Booked'});
            return finalBooking;

        } catch (error) {
            if(error.name=="RepositoryError" || error.name=="ValidationError"){ //because these have come from Repository layer so just return this simply
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports= BookingService;