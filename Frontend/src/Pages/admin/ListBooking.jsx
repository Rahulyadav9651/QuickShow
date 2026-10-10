import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from './Title';
import { dateFormat } from '../../lib/dateFormet';

const ListBooking = () => {

const[bookings, setBookings]= useState([]);
const[isLoading, setLoading]= useState(true);


const getAllBkkings= async()=>{

  setBookings(dummyBookingData);
  setLoading(false);
};

useEffect(()=>{
getAllBkkings();
},[]);






  return !isLoading ? (
    <>
      <Title text1="List" text2="Bookings"/>
<div className='max-w-4xl mt-6 overflow-x-auto '>
<table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
<thead>
  <tr className='bg-primary/20 text-left text-white '>
<th className='p-2 font-medium'>User Name</th>
<th className='p-2 font-medium'>Movie Name</th>
<th className='p-2 font-medium'>Show Name</th>
<th className='p-2 font-medium'>Seats Name</th>
<th className='p-2 font-medium'>Amount</th>

  </tr>
</thead>
<tbody className='text-sm font-light'>
{
  bookings.map((item, index)=>(
    <tr key={index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/10'>
<td className='p-2 min-w-45 pl-5'>{item.user.name}</td>
<td className='p-2 min-w-45 pl-5'>{item.show.movie.title}</td>
<td className='p-2 min-w-45 pl-5'>{dateFormat(item.show.showDateTime)}</td>
<td className="p-2">
  {Object.entries(item.bookedSeats).map(([seat, value]) => (
    <span key={seat} className="mr-2">
      {Array.isArray(value) ? value.join(", ") : value}
    </span>
  ))}
</td>

<td className="p-2">₹{item.amount}</td>


    </tr>
  ))
}


</tbody>
</table>

</div>

    </>
  ) : <Loading/>
}

export default ListBooking
