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
import { useAppContext } from './context/AppContext'
import { SignIn } from '@clerk/react'
import Loading from './components/Loading'




function App() {
 
const isAdminRoute= useLocation().pathname.startsWith('/admin');

const {user}= useAppContext()



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
<Route path='/loading/:nextUrl' element={<Loading/>}/>


<Route path='/favorite' element={<Favorite/>}/>

<Route path='/admin/*' element={ user ?  <Layout/>:(<div className='min-h-screen flex justify-center items-center'><SignIn fallbackRedirectUrl={'/admin'}/></div>)} >
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
