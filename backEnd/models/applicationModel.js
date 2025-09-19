import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate_id: { type: String, required: true },  // You might want to use a reference if you have a `User` model
  candidate_name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['applied', 'interviewing', 'hired', 'rejected'], 
    default: 'applied' 
  },
  skills: { type: String, required: true },
  experience: { type: Number, required: true },
  resumePath: { type: String, required: true },
  education: { type: String, required: true }
}, { timestamps: true }); // Enable timestamps

const Application = mongoose.model('Application', applicationSchema);
export default Application;
