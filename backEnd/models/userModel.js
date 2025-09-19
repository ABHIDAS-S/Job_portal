import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkUserId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName : { type: String, required: true },
  
});

export default mongoose.model("User", userSchema)