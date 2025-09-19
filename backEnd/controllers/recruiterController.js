import JobModel from "../models/jobModel.js";
import ApplicationModel from "../models/applicationModel.js";
import CompanyModel from "../models/companyModel.js";
import mongoose from "mongoose";
import cloudinary from "../config/coludinary.js";
import fs from "fs/promises";

/**
 * @desc To change the job hiring status
 * @route GET /api/recruiter/changeHiringStatus
 * @access Public
 */

export const changeHiringStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { jobId } = req.params;

    const job = await JobModel.findByIdAndUpdate(
      jobId,
      { isOpen: status === "open" },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res
      .status(200)
      .json({ message: "Hiring status updated successfully", job });
  } catch (error) {
    console.error("Error updating hiring status:", error);

    res.status(500).json({
      message: "An error occurred while updating hiring status",
      error: error.message,
    });
  }
};

/**
 * @desc To change the application status
 * @route GET /api/recruiter/changeApplicationStatus
 * @access Public
 */

export const changeApplicationStatus = async (req, res) => {
  const applicationId = req.params.applicationId;
  const { status } = req.body;
  try {
    const updateApplication = await ApplicationModel.findByIdAndUpdate(
      applicationId,
      { status: status },
      { new: true }
    );

    if (!updateApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json({
      message: "Application status updated successfully",
      application: updateApplication,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({
      message: "An error occurred while updating application status",
      error: error.message,
    });
  }
};

/**
 * @desc To add a new company
 * @route GET /api/recruiter/addCompany
 * @access Public
 */

export const addCompany = async (req, res) => {
  let cloudinaryResponse = null;

  try {
    const { name } = req.body;
    const logo = req.files.logo;


    ///upload image to cloudinary
    if (logo) {
      cloudinaryResponse = await cloudinary.uploader.upload(logo.tempFilePath, {
        folder: "companyLogo",
      });
    }

    // If image upload is successful, create and save new company

    const company = new CompanyModel({
      name,
      logo: cloudinaryResponse.secure_url,
    });
    await company.save();

    res
      .status(201)
      .json({ message: "Company added successfully", company: company });
  } catch (error) {
    console.error("Error adding company:", error);

    // Attempt to delete the uploaded image if it exists
    if (cloudinaryResponse && cloudinaryResponse.public_id) {
      try {
        await cloudinary.uploader.destroy(cloudinaryResponse.public_id);
    
      } catch (deleteError) {
        console.error("Error deleting image from Cloudinary:", deleteError);
      }
    }

    res.status(500).json({
      message: "An error occurred while adding company",
      error: error.message,
    });
  } finally {
    if (req.files.logo && req.files.logo.tempFilePath) {
      try {
        await fs.unlink(req.files.logo.tempFilePath);
      } catch (unlinkError) {
        console.error("Error deleting temporary file:", unlinkError);
      }
    }
  }
};

/**
 * @desc To post a new job
 * @route GET /api/recruiter/postJob
 * @access Public
 */

export const postJob = async (req, res) => {
  const { title, description, location, company_id, requirements } = req.body;

  try {
    const job = new JobModel({
      recruiter_id: req.auth.userId,
      title,
      description,
      location,
      company: company_id,
      requirements,
      isOpen: true,
      applications: [],
    });
    await job.save();
    res.status(201).json({ message: "Job posted successfully", job: job });
  } catch (error) {
    console.error("Error posting job:", error);

    res.status(500).json({
      message: "An error occurred while posting job",
      error: error.message,
    });
  }
};

/**
 * @desc To get recruiter's jobs
 * @route GET /api/recruiter/getMyJobs
 * @access Public
 */

export const getMyJobs = async (req, res) => {
  try {

    const jobs = await JobModel.find({
      recruiter_id: req.auth.userId,
    }).populate("company");

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }
    res.status(200).json({ message: "Jobs fetched successfully", data:jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      message: "An error occurred while fetching jobs",
      error: error.message,
    });
  }
};


/**
 * @desc To delete a job
 * @route GET /api/recruiter/deleteJob
 * @access Public
 */

export const deleteJob = async (req, res) => {
  const jobId = req.params.jobId;
  try {
    const job = await JobModel.findByIdAndDelete(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      message: "An error occurred while deleting job",
      error: error.message,
    });
  }
};
