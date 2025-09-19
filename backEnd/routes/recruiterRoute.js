import express from "express";
import {
  changeHiringStatus,
  changeApplicationStatus,
  addCompany,
  postJob,
  getMyJobs,
  deleteJob,
} from "../controllers/recruiterController.js";

const router = express.Router();
router.patch("/changeHiringStatus/:jobId", changeHiringStatus);
router.patch(
  "/changeApplicationStatus/:applicationId",
  changeApplicationStatus
);
router.post("/addCompany", addCompany);
router.post("/postJob", postJob);
router.get("/getMyJobs", getMyJobs);
router.delete("/deleteJob/:jobId", deleteJob);
export default router;
