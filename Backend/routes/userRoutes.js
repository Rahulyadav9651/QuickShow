import express from "express";
import { getFavorites, getUserBookings, updatedFavorite } from "../controllers/userController.js";


const userRouter = express.Router();


userRouter.get('/bookings', getUserBookings);
userRouter.post('/update-favorite', updatedFavorite)
userRouter.get('/favorites', getFavorites)


export default userRouter