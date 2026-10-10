import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './Pages/Home'
import Movies from './Pages/Movies'
import MoviesDetails from './Pages/MoviesDetails'
import SeatLayout from './Pages/SeatLayout'
import MyBooking from './Pages/MyBooking'
import Favorite from './Pages/Favorite'
import {Toaster} from "react-hot-toast";
import Layout from './Pages/admin/Layout'
import Dashboard from './Pages/admin/Dashboard'
import AddShows from './Pages/admin/AddShows'
import ListShows from './Pages/admin/ListShows'
import ListBooking from './Pages/admin/ListBooking'




function App() {
 
const isAdminRoute= useLocation().pathname.startsWith('/admin');
  return (
    <div>
      {!isAdminRoute && <Navbar/>}
<Toaster/>

<Routes>
<Route path='/' element={<Home/>}/>
<Route path='/movies' element={<Movies/>}/>
<Route path='/movies/:id' element={<MoviesDetails/>}/>
<Route path='/movies/:id/:date' element={<SeatLayout/>}/>
<Route path='/my-bookings' element={<MyBooking/>}/>
<Route path='/favorite' element={<Favorite/>}/>

<Route path='/admin/*' element={<Layout/>} >
<Route index element={<Dashboard/>}/>
<Route  path='add-shows' element={<AddShows/>}/>
<Route  path='list-shows' element={<ListShows/>}/>
<Route  path='list-bookings' element={<ListBooking/>}/>


</Route>

</Routes>
{!isAdminRoute && <footer/>}

    </div>
  )
}

export default App
