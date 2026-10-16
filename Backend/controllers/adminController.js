import Booking from "../models/Booking.js";

import User from "../models/User.js"

//APi to check id user is admin

//import Booking from "../models/Booking";
import Show from "../models/Show.js";

export const isAdmin= async(req, res)=>{

    return res.status(200).json({
        success:true,
        isAdmin:true
    })

}

import { clerkClient } from "@clerk/express";



//API to get dashboard data



export const getDashboardData= async(req, res)=>{

    try{
const bookings= await Booking.find({isPaid:true});
const activeShows= await Show.find({showDateTime:{$gte: new Date()}}).populate('movie');
const totalUser= await User.countDocuments();

const dashboardData={
    totalBookings:bookings.length,
    totalRevenue:bookings.reduce((acc,booking)=>acc+booking.amount,0),
    activeShows,
    totalUser
}
return res.status(200).json({
    success:true,
    dashboardData
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

// API  to get all shows

export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate('movie')
      .sort({ showDateTime: 1 });

    return res.status(200).json({
      success: true,
      shows,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Api to get All Bookings

export const getAllBooking= async(req, res)=>{
try{
const bookings= await Booking.find({}).populate('user').populate({
    path:"show",
    populate:{path:"movie"}
}).sort({createdAt:-1})

return res.json({
    success:true,
 bookings,
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