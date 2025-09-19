import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true }  // URL or path to the logo image
}, { timestamps: true }); // Enable timestamps

const Company = mongoose.model('Company', companySchema);
export default Company;
