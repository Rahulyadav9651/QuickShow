import React, {  useEffect, useState } from 'react'
import {dummyBookingData} from "../assets/assets"
import Loading from '../components/Loading';
import BlurCircle from '../components/BlurCircle';
import timeFormat from '../lib/timeFormet';
import { dateFormat } from '../lib/dateFormet';
import { useAppContext } from '../context/AppContext';

const MyBooking = () => {

const {axios,getToken,user, image_base_url}= useAppContext(); 


  const[booking, setBooking]= useState([]);

  const [isLoading, setIsLoading]= useState(true);
  
// const getMtBooking= async ()=>{
//   // setBooking(dummyBookingData)
//   // setIsLoading(false);

// try{
// const {data}= await axios.get('/api/user/bookings',{
//   headers:{Authorization:`Bearer ${await getToken()}`}
// })
// //onsole.log("ds",data)
// if(data.success){
//   setBooking(data.bookings)
// }

// }
// catch(error){
// console.log(error)
// }
// setIsLoading(false);

// }

const getMyBooking = async () => {
  try {
    const token = await getToken();
    console.log("token:", token);
    console.log("user id:", user?.id);

    const { data } = await axios.get('/api/user/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("API response:", data);

    if (data.success) {
      setBooking(data.bookings);
    } else {
      console.log("API error:", data.message);
    }
  } catch (error) {
    console.log("Request failed:", error.response?.status, error.response?.data || error.message);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  if (user?.id) getMyBooking();
}, [user?.id]);


console.log("bookin",booking)
useEffect(()=>{

if(user){
//getMtBooking();
getMyBooking();
}


},[user])

//console.log("fd",booking)
  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left='100px'/>

<div>
  <BlurCircle bottom="0px" left="600px"/>
</div>
<h1 className='text-lg font-semibold mb-4'>My Booking</h1>

{
  booking.map((item,index)=>(
    <div className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl` ' key={index}>
      <div className='flex flex-col md:flex-row'>
<img src={ image_base_url+item.show.movie.poster_path} alt='pos' className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'/>
<div className='flex flex-col p-4'>
  <p className='text-lg font-semibold'>{item.show.movie.title}</p>
  <p className='text-gray-400 text-sm'>{timeFormat(item.show.movie.runtime)}</p>
    <p className='text-gray-400 text-sm mt-auto'>{dateFormat(item.show.showDateTime)}</p>


   </div>
         </div>

<div className='flex flex-col md:items-end md:text-right justify-between p-4'>
  <div className='flex items-center gap-4'>
    <p className='text-2xl font-semibold mb-3'>₹{item.amount}</p>
    {!item.isPaid && <button className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'>Pay Now</button>}
     </div>
   </div>

<div className='text-sm'>
<p><span className='text-gray-400'>Total Tickets:</span>{item.bookedSeats.length}</p>

<p><span className='text-gray-400'>Seat Number:</span>{item.bookedSeats.join(", ")}</p>


  </div>


       </div>
  ))
}
 
    </div>

  ): <Loading/>
}

export default MyBooking

