
import { Inngest } from "inngest";
import User from "../models/User.js";

export const inngest = new Inngest({
    id: "movie-ticket-bookings",
});

// Sync Clerk user creation to MongoDB
const syncUserCreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk",
        triggers: [{ event: "clerk/user.created" }],
    },
    async ({ event }) => {
        const {
            id,
            first_name,
            last_name,
            email_addresses,
            image_url,
        } = event.data;

        const userData = {
            _id: id,
            email: email_addresses?.[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}`.trim(),
            image: image_url,
        };

        await User.create(userData);
    }
);

//Function deleted from DB

const UserDeletion = inngest.createFunction(
    {
        id: "deleted-user-with-clerk",
        triggers: [{ event: "clerk/user.deleted" }],
    },
    async ({ event }) => {
        const { id } = event.data;

        await User.findByIdAndDelete(id);
    }
);

//Function to update user Data


const syncUserUpdation = inngest.createFunction(
    {
        id: "sync-user-updated-from-clerk",
        triggers: [{ event: "clerk/user.updated" }],
    },
    async ({ event }) => {
        const {
            id,
            first_name,
            last_name,
            email_addresses,
            image_url,
        } = event.data;

        await User.findByIdAndUpdate(
            id,
            {
                name: `${first_name || ""} ${last_name || ""}`.trim(),
                email: email_addresses?.[0]?.email_address,
                image: image_url,
            },
            { new: true }
        );
    }
);





export const functions = [syncUserCreation,UserDeletion,syncUserUpdation];
