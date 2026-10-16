

//GEt user Booking

import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

export const getUserBookings= async(req, res)=>{

    try{
const user= req.auth().userId;
const bookings= await Booking.find({user}).populate({
    path:"show",
    populate:{path:"movie"}

}).sort({createdAt:-1})
return res.status(200).json({
    success:true,
    bookings
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



//Add Favorite movie 



// export const getUserBookings = async (req, res) => {
//   try {
//     const { userId } = req.auth();

//     console.log("Authenticated userId:", userId);

//     // Check all bookings in the database
//     const allBookings = await Booking.find({});
//     console.log("Total bookings:", allBookings.length);

//     // Find bookings belonging to the logged-in user
//     const userBookings = await Booking.find({ user: userId });

//     console.log("User bookings:", userBookings.length);

//     // Populate show and movie details
//     const bookings = await Booking.find({ user: userId })
//       .populate({
//         path: "show",
//         populate: {
//           path: "movie",
//         },
//       })
//       .sort({ createdAt: -1 });

//     console.log(
//       "Populated bookings:",
//       JSON.stringify(bookings, null, 2)
//     );

//     return res.status(200).json({
//       success: true,
//       bookings,
//     });
//   } catch (error) {
//     console.error("Get user bookings error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



export const updatedFavorite = async(req, res)=>{

    try{
const {movieId} = req.body;
const userId= req.auth().userId;
const user= await clerkClient.users.getUser(userId)

if(!user.privateMetadata.favorites){
user.privateMetadata.favorites=[]

}
if(!user.privateMetadata.favorites.includes(movieId)){
    user.privateMetadata.favorites.push(movieId)
}

else{
    user.privateMetadata.favorites=user.privateMetadata.favorites.filter((item)=>item!==movieId)
}

await clerkClient.users.updateUserMetadata(userId,{privateMetadata:user.privateMetadata})

return res.status(200).json({
    success:true,
message:"Favorite updated Successfully"

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


//list movie favorite

export const getFavorites= async(req, res)=>{

    try{
const user= await clerkClient.users.getUser(req.auth().userId)
const favorites= user.privateMetadata.favorites
//Getting movies from DB
const movies= await Movie.find({_id: {$in : favorites}})

return res.status(200).json({
    success:true,
    movies
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