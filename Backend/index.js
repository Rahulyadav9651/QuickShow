
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const express = require("express");
//const cors = require("cors");
const database = require("./config/database");
const   {clerkMiddleware}  =require("@clerk/express") 
const {serve}=  require("inngest/express")
const {inngest, functions} = require("./Inngest/index")
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
//app.use(cors());

app.use(clerkMiddleware())


// Connect to database
database.DbConnect();

// Test API route
app.get("/", (req, res) => {
    res.status(200).send("Server is live");
});
app.use('/api/inngest', serve({client:inngest, functions}))
// Start server
app.listen(port, () => {
    console.log(`App is listening at PORT ${port}`);
});
