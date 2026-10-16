
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  assets,
  dummyDateTimeData,
  dummyShowsData,
} from '../assets/assets';
import Loading from '../components/Loading';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import isoTimeFormet from '../lib/isoTimeFormet';
import BlurCircle from '../components/BlurCircle';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';




const SeatLayout = () => {
  const { id, date } = useParams();


const {axios, getToken, user}= useAppContext(); 

  const groupRows = [
    ['A', 'B'],
    ['C', 'D'],
    ['E', 'F'],
    ['G', 'H'],
    ['I', 'J'],
  ];

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
const [occupidSeats, setOccupidSeats]= useState([])

  const navigate = useNavigate();

  const getShow = async () => {
    // const show = dummyShowsData.find((show) => show._id === id);

    // if (show) {
    //   setShow({
    //     movie: show,
    //     dateTime: dummyDateTimeData,
    //   });
    // }

try{
const {data}= await axios.get(`/api/show/${id}`)
if(data.success){
  setShow(data)
}

}

catch(error){
  console.log(error)
}



  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast('Please select time first.');
    }

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast('You can only select 5 Seats.');
    }
if(occupidSeats.includes(seatId)){
  return toast('This seat is already booked')
}
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

// const getOccupidSeats = async ()=>{

// try{
// const {data}= await axios.get(`/api/booking/seats/${selectedSeats.showId}`)
// if(data.success){
//   setOccupidSeats(data.occupidSeats)
// }else{
//   toast.error(data.message)
// }

// }
// catch(error){
// console.log(error)

// }


// }
const getOccupidSeats = async () => {
  try {
    const { data } = await axios.get(`/api/bookings/seats/${selectedTime.showId}`);
    if (data.success) {
      setOccupidSeats(data.occupidSeats);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
  }
};

  const renderSeats = (row, count = 9) => (
    <div
      key={row}
      className="flex items-center justify-center gap-2"
    >
      {Array.from({ length: count }, (_, i) => {
        const seatId = `${row}${i + 1}`;

        return (
          <button
            key={seatId}
            onClick={() => handleSeatClick(seatId)}
            className={`
              h-8 w-8
              rounded-md
              border border-primary/60
              text-xs
              transition-all
              duration-200
              cursor-pointer
              hover:bg-primary/20
              ${
                selectedSeats.includes(seatId)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-transparent'
              }
              ${occupidSeats.includes(seatId) && "opacity-50"}
            `}
            
          >
            {seatId}
          </button>
        );
      })}
    </div>
  );

const bookTicket= async ()=>{

  try{
    if(!user) return toast.error('Please login to proceed')

      if(!selectedTime || !selectedSeats.length) return toast.error('Please select a time and seats')

const {data}= await axios.post('/api/bookings/create',{showId:selectedTime.showId, selectedSeats},{headers:{Authorization:`Bearer ${await getToken()}`}});
      if(data.success){
        //toast.success(data.message)
        window.location.href=data.url;
        //navigate('/my-bookings')
      }else{
      toast.error(data.message);
      }

  }
  catch(error){
    toast.error(error.message)
  }


}



useEffect(()=>{
  if(selectedTime){
    getOccupidSeats()
  }
},[selectedTime])

  useEffect(() => {
    getShow();
  }, [id]);

  if (!show) {
    return <Loading />;
  }

  const timings = show.dateTime[date] || [];

  return (
    <div className="flex flex-col md:flex-row gap-8 px-6 md:px-16 lg:px-40 py-10 md:pt-32 min-h-screen">

      {/* ================= AVAILABLE TIMINGS ================= */}
      <div className="w-full md:w-64 bg-primary/10 border border-primary/20 rounded-lg p-6 h-max md:sticky md:top-10">

        <p className="font-semibold text-lg mb-6">
          Available Timings
        </p>

        <div className="space-y-2">
          {timings.map((item) => (
            <div
              key={item.time}
              onClick={() => setSelectedTime(item)}
              className={`
                flex items-center gap-3
                px-4 py-3
                rounded-md
                cursor-pointer
                transition-all duration-200
                ${
                  selectedTime?.time === item.time
                    ? 'bg-primary text-white'
                    : 'hover:bg-primary/20'
                }
              `}
            >
              <ClockIcon className="w-4 h-4" />

              <p>{isoTimeFormet(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SEAT LAYOUT ================= */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16 overflow-hidden">

        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />

        <h1 className="text-2xl font-semibold mb-4">
          Select Your Seat
        </h1>

        {/* Screen */}
        <img
          src={assets.screenImage}
          alt="screen"
          className="w-full max-w-xl h-auto"
        />

        <p className="text-gray-400 text-sm mb-8 mt-2">
          SCREEN SIDE
        </p>

        {/* Seats */}
        <div className="flex flex-col items-center gap-6 text-xs text-gray-300">

          {/* A B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>

          {/* C-J */}
          <div className="flex flex-col gap-3">
            {groupRows.slice(1).map((group, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {group.map((row) => renderSeats(row))}
              </div>
            ))}
          </div>

        </div>

<button onClick={bookTicket} className='flex gap-1.5 mt-20 items-center px-5 py-2 border bg-primary rounded-full cursor-pointer text-sm hover:bg-primary-dull transition font-medium active-scale-95'>Proceed to Checkout 

  <ArrowRightIcon strokeWidth={3} className='w-4 h-4'/>
</button>

      </div>
      
    </div>
  );
};

export default SeatLayout;




