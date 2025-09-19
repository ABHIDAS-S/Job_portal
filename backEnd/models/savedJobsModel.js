import mongoose from 'mongoose';

const savedJobsSchema = new mongoose.Schema({
  user_id: { type: String, required: true },  // You might want to use a reference if you have a `User` model
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }
}, { timestamps: true }); // Enable timestamps

const SavedJobs = mongoose.model('SavedJobs', savedJobsSchema);
export default SavedJobs;
