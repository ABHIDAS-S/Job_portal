import { clerkClient } from "@clerk/clerk-sdk-node";

export const validateSession = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    // Verify and decode the token
    const decodedToken = await clerkClient.verifyToken(token);
    // Extract user ID from the decoded token
    const userId = decodedToken.sub;

    // Optionally, fetch more user details if needed
    const user = await clerkClient.users.getUser(userId);
    // Attach user info to the request object
    req.auth = {
      userId: userId,
      user: user, // This includes more detailed user information
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};
