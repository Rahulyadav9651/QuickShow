import Booking from "../models/Booking.js";
import Show from "../models/Show.js"
import stripe from "stripe";



//function to check seats availability 
const checkSeatsAvailability= async (showId, selectedSeats)=>{

    try{
const showData= await Show.findById(showId)
if(!showData) false;
const occupidSeats= showData.occupidSeats;
const isAnySeatTaken= selectedSeats.some(seat=>occupidSeats[seat]);
return !isAnySeatTaken;


    }
    catch(error){
console.log(error);
return res.status(501).json({
    success:false,
    message:error.message,
})

    }




}



export const createBookings= async(req , res)=>{

    try{
const {userId}= req.auth();
const {showId, selectedSeats}= req.body;
const {origin}= req.headers;
const isAvailable= await checkSeatsAvailability(showId, selectedSeats)

if(!isAvailable){
    return res.status(401).json({
        success:false,
        message:"Selected Seats are not available."
    })
}
//get the show details
const  showData= await Show.findById(showId).populate('movie');

//create a new Bookings
const booking= await Booking.create({
    user:userId,
    show:showId,
    amount:showData.showPrice*selectedSeats.length,
    bookedSeats:selectedSeats
})
selectedSeats.map((seat)=>{
    showData.occupidSeats[seat]= userId;
})
showData.markModified('occupidSeats');
await showData.save();



//Stipe Gateway
const stripeInstance= new stripe(process.env.STRIPE_SECRET_KEY)
//creating line itme
const line_item=[{
    price_data:{
        currency:'usd',
        product_data:{
            name:showData.movie.title
        },
        unit_amount:Math.floor(booking.amount)*100
    },
    quantity:1
}]

const session= await stripeInstance.checkout.sessions.create({
    success_url:`${origin}/loading/my-bookings`,
    cancel_url:`${origin}/my-bookings`,
    line_items:line_item,
    mode:'payment',
    metadata:{
        bookingId:booking._id.toString()

    },
    expires_at:Math.floor(Date.now()/1000)+30*60,

})
booking.paymentLink= session.url
await booking.save()


return res.status(200).json({
    success:true,
    url:session.url
})
    }
    catch(error){
console.log(error);
return res.status(501).json({
    success:false,
    message:error.message,
})

    }


}


export const getOccupidSeats= async(req, res)=>{

    try{
const {showId}= req.body;
const showData= await Show.findById(showId)

const occupiedSeats= Object.keys(showData.occupidSeats)
return res.status(200).json({
    success:true,
    occupiedSeats,
})

    }
    catch(error){
console.log(error);
return res.status(501).json({
    success:false,
    message:error.message,
})

    }



}



