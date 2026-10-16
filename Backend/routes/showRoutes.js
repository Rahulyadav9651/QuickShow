// import express from "express";
// //const express= require("express");
// import { getNowPlayingMovies } from "../controllers/showControllers.js";
// const router= express.Router();


// router.get('/now-playing',getNowPlayingMovies)

// //export default router;
// module.exports=router;


import express from "express";
import { addShow, getNowPlayingMovies, getShow, getShows } from "../controllers/showControllers.js";
import { protectAdmin } from "../middleware/auth.js";

const showrouter = express.Router();

showrouter.get("/now-playing",protectAdmin, getNowPlayingMovies);
showrouter.post('/add', protectAdmin, addShow);
showrouter.get('/all', getShows);
showrouter.get('/:movieId', getShow)


export default showrouter;
