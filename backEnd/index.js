import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./config/db.js";
import candidateRoute from "./routes/candidateRoute.js";
import recruiterRoute from "./routes/recruiterRoute.js";
import { validateSession } from "./middlewares/clerkAuth.js";
import fileUpload from 'express-fileupload';

dotenv.config();
const port = process.env.PORT || 8000;
connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: false,  // Disable temporary file usage
  createParentPath: true
}));
app.use(cors({
  origin: ['http://localhost:5173', 'https://job-portal-frontend-zruf.onrender.com', 'https://hiregrade.vercel.app'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization','Accept'],
}));




/////defining routes

app.use(
  "/api/candidate",
  validateSession,
  candidateRoute
);
app.use(
  "/api/recruiter",
  validateSession,
  recruiterRoute
);

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(401).send("Unauthenticated!");
// });

app.get("/", (req, res) => res.send("Server is ready"));
app.listen(port, () => console.log(`Server started on port ${port}`));