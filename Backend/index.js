
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

// CORS configuration
app.use(
    cors({
        origin: "https://quickshow-94b5f.web.app",
        credentials: true,
    })
);

// Stripe webhook must receive the raw body
app.use(
    "/api/stripe",
    express.raw({ type: "application/json" }),
    stripeWebhooks
);

// General middleware
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use("/api/show", showRoutes);
app.use("/api/bookings", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

// Health check
app.get("/", (req, res) => {
    res.status(200).send("Server is live");
});

// Inngest endpoint
app.use("/api/inngest", serve({ client: inngest, functions }));

// Connect to database
database.DbConnect();

// Start server
app.listen(port, () => {
    console.log(`App is listening at PORT ${port}`);
});
