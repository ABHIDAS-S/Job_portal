import { application } from "express";
import Application from "../models/applicationModel.js";
import JobModel from "../models/jobModel.js";
import SavedJobs from "../models/savedJobsModel.js";
import cloudinary from "../config/coludinary.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

/**
 * @desc Get all available jobs
 * @route GET /api/candidate/jobLists
 * @access Public
 */
export const getJobLists = async (req, res) => {
  try {

    const {
      searchQuery,
      company_id,
      location,
      page = 1,
      limit = 6,
    } = req.query;
    const skip = (page - 1) * limit;

    // throw new Error("Not implemented");

    let filter = {};

    if (searchQuery) {
      filter.title = { $regex: searchQuery, $options: "i" };
    }

    if (company_id) {
      filter.company = company_id;
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // Fetch all available jobs
    const availableJobs = await JobModel.find(filter, "-__v")
      .populate("company")
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    // Fetch saved jobs for the user
    const savedJobs = await SavedJobs.find({ user_id: req.auth.userId })
      .lean()
      .exec();

    // Create a Set of saved job IDs for quick lookup
    const savedJobIds = new Set(savedJobs.map((job) => job.job_id.toString()));

    // Add 'saved: true' to jobs that are in the saved list
    const jobsWithSavedFlag = availableJobs.map((job) => ({
      ...job,
      saved: savedJobIds.has(job._id.toString()),
    }));

    res.status(200).json({
      success: true,
      message:
        jobsWithSavedFlag.length > 0
          ? "Jobs fetched successfully"
          : "No jobs found",
      count: jobsWithSavedFlag.length,
      data: jobsWithSavedFlag,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);

    res.status(500).json({
      success: false,
      message: "An error occurred while fetching jobs",
      error: error.message,
    });
  }
};

/**
 * @desc To save or unsave a job
 * @route GET /api/candidate/saveJob
 * @access Public
 */

export const saveJob = async (req, res) => {
  try {
    const job_id = req.params.job_id;
    const user_id = req.auth.userId;

    const savedJob = await SavedJobs.findOne({ user_id, job_id });
    if (savedJob) {
      await SavedJobs.deleteOne({ _id: savedJob._id });
    } else {
      const newSavedJob = new SavedJobs({ user_id, job_id });
      await newSavedJob.save();
    }

    res.status(200).json({
      success: true,
      message: savedJob ? "Job unsaved successfully" : "Job saved successfully",
    });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while saving the job",
      error: error.message,
    });
  }
};

/**
 * @desc To apply for a job
 * @route POST /api/candidate/applyJob
 * @access Public
 */

export const applyJob = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const {
      experience,
      skills,
      education,
      job_id,
      candidate_id,
      name,
      status,
    } = req.body;

    // Check if resume file is uploaded
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: "No resume file uploaded" });
    }

    const resumeFile = req.files.resume;

    // Generate a unique file name
    const fileName = `${uuidv4()}-${resumeFile.name
      .replace(/\s+/g, "-")
      .replace(/\.pdf$/i, "")}`;

    // Direct buffer upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: "resumes", 
          public_id: fileName,
          resource_type: "raw", 
          format: "pdf",
          access_mode: "public"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(resumeFile.data);
    });

    const downloadURL = result.secure_url; // Cloudinary URL

    // Create a new application record in the database
    const newApplication = new Application({
      job_id,
      candidate_id,
      candidate_name: name,
      status,
      skills,
      experience: Number(experience),
      education,
      resumePath: downloadURL, // Cloudinary URL
    });

    const savedApplication = await newApplication.save({ session });
    if (!savedApplication) {
      throw new Error("Error submitting application");
    }

    const job = await JobModel.findById(job_id);
    job.applications.push(savedApplication._id);
    const updatedJob = await job.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Application submitted successfully",
      application: savedApplication,
      job: updatedJob,
    });
  } catch (error) {
    // Catch and handle any errors
    console.error("Error submitting application:", error);
    
    // Ensure session is ended even if there's an error
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();

    return res.status(500).json({ 
      message: "Error submitting application", 
      error: error.message 
    });
  }
};
/**
 * @desc To fetch Saved jobs
 * @route GET /api/candidate/fetchSavedJobs
 * @access Public
 */

export const fetchSavedJobs = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // Fetch saved jobs with job and company details
    const savedJobs = await SavedJobs.find({ user_id: userId })
      .populate({
        path: "job_id",
        populate: { path: "company" },
      })
      .lean(); // Improve performance by returning plain JS objects

    // If no saved jobs are found, return 404
    if (!savedJobs || savedJobs.length === 0) {
      return res.status(404).json({ message: "No saved jobs found" });
    }

    // Add `saved: true` inside each `job_id`
    const flaggedJobs = savedJobs.map((job) => ({
      ...job,
      job_id: {
        ...job.job_id,
        saved: true, // Add saved flag inside job_id
      },
    }));

    // Return the modified jobs
    res.status(200).json({ data: flaggedJobs });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching saved jobs" });
  }
};

/**
 * @desc To fetch created applications
 * @route GET /api/candidate/fetchApplications
 * @access Public
 */

export const fetchApplications = async (req, res) => {
  const userId = req.auth.userId;
  try {
    const applications = await Application.find({ candidate_id: userId })
      .populate({
        path: "job_id",
        populate: { path: "company" },
      }) // Populating job_id as usual
      .lean(); // Using lean() to get plain JS objects

    // Rename `job_id` to `job`
    const modifiedApplications = applications.map((application) => ({
      ...application,
      job: application.job_id, // Alias `job_id` to `job`
    }));

    if (!modifiedApplications || modifiedApplications.length === 0) {
      return res.status(404).json({ message: "No applications found" });
    }

    return res.status(200).json({
      message: "Applications fetched successfully",
      data: modifiedApplications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching applications" });
  }
};
