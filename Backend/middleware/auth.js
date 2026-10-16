import { clerkClient } from "@clerk/express";



export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    const user = await clerkClient.users.getUser(userId);
    console.log("userId:", userId);
    console.log("private:", user.privateMetadata);

    if (user.privateMetadata.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "not authorized",
    });
  }
};


