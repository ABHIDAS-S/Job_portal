import mongoose from 'mongoose';
import Company from './companyModel.js';
const jobSchema = new mongoose.Schema({
  recruiter_id: { type: String, required: true },  // You might want to use a reference if you have a `User` model
  title: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  requirements: { type: String, required: true },
  isOpen: { type: Boolean, default: true },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
}, { timestamps: true }); // Enable timestamps

const Job = mongoose.model('Job', jobSchema);
export default Job;
