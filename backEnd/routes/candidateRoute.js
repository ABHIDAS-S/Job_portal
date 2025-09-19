import express from "express";
import { getJobLists , saveJob,applyJob,fetchSavedJobs,fetchApplications} from "../controllers/candidateController.js";
import { getCompanies,getJobDetails } from "../controllers/commonController.js";

const router = express.Router();

router.get("/jobLists", getJobLists)
router.post("/saveJob/:job_id", saveJob)
router.get("/getCompanies", getCompanies)
router.get("/jobDetails/:id", getJobDetails)
router.post("/applyJob/:id", applyJob)
router.get("/fetchSavedJobs", fetchSavedJobs)
router.get("/fetchApplications", fetchApplications)

export default router