
// const dns = require("dns");
// dns.setServers(["8.8.8.8", "1.1.1.1"]);

// require("dotenv").config();

// const express = require("express");
// //onst cors = require("cors");
// const cors=require("cors");
// const database = require("./config/database");
// const   {clerkMiddleware}  =require("@clerk/express") 
// const {serve}=  require("inngest/express")
// const {inngest, functions} = require("./Inngest/index")
// const app = express();
// const port = process.env.PORT || 3000;
// //const showRoutes= require("./routes/showRoutes");
// import showRoutes from "./routes/showRoutes.js";

// // Middleware


// app.use(express.json());
// app.use(
//     cors({
//         origin: "https://quickshow-94b5f.web.app/",
//         credentials: true,
//     })
// );

// app.use(clerkMiddleware())
// app.use('api/show',showRoutes)

// // Connect to database
// database.DbConnect();

// // Test API route
// app.get("/", (req, res) => {
//     res.status(200).send("Server is live");
// });
// app.use('/api/inngest', serve({client:inngest, functions}))
// // Start server
// app.listen(port, () => {
//     console.log(`App is listening at PORT ${port}`);
// });



import dns from "node:dns";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

import database from "./config/database.js";
import { inngest, functions } from "./Inngest/index.js";
import showRoutes from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const port = process.env.PORT || 3000;
//stripe webhook
app.use('/api/stripe',express.raw({type:'application/json'}), stripeWebhooks)


// Middleware
app.use(express.json());
//https://quickshow-5k0d.onrender.com/

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            //"https://quickshow-5k0d.onrender.com",
        ],
        credentials: true,
    })
);


app.use(clerkMiddleware());

// Routes
app.use("/api/show", showRoutes);
app.use("/api/bookings",bookingRouter);
app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)

app.get("/", (req, res) => {
    res.status(200).send("Server is live");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

// Connect to database
database.DbConnect();

// Start server
app.listen(port, () => {
    console.log(`App is listening at PORT ${port}`);
});
