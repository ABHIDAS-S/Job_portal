import Application from "../models/applicationModel.js";
import CompanyModel from "../models/companyModel.js";
import JobModel from "../models/jobModel.js";

/**
 * @desc Get all companies
 * @route GET /api/[candidate/recruiter]/getCompanies
 * @access Public
 */
export const getCompanies = async (req, res) => {
  try {
    const companies = await CompanyModel.find({}, { name: 1, _id: 1 })
      .lean()
      .exec();
    res.status(200).json({
      success: true,
      message:
        companies.length > 0
          ? "Companies fetched successfully"
          : "No companies found",
      data: companies,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching companies",
      error: error.message,
    });
  }
};

/**
 * @desc Get the details of a single job
 * @route GET /api/[candidate/recruiter]/jobDetails
 * @access Public
 */

export const getJobDetails = async (req, res) => {
  try {
    const job_id = req.params?.id;
    const jobDetails = await JobModel.findById(job_id)
      .populate("company")
      .populate("applications")
      .lean()
      .exec();

    //check if the user is already applied;
    const user_id = req.auth?.userId;
    const isApplied = await Application.findOne({
      job_id: job_id,
      candidate_id: user_id,
    });

    if (jobDetails) {
      res.status(200).json({
        success: true,
        message: "Job details fetched successfully",
        data: { ...jobDetails, isApplied: !!isApplied },
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Job details not found",
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "An error occurred while fetching job details",
      error: error.message,
    });
  }
};
