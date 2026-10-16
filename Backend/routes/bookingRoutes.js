import express from 'express';
import { createBookings, getOccupidSeats } from '../controllers/BookingsControllers.js';



const bookingRouter= express.Router();



bookingRouter.post('/create',createBookings);

bookingRouter.get('/seats/:showId',getOccupidSeats);


export default bookingRouter;