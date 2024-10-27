import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    ofUser: {
      type:mongoose.Types.ObjectId,
      ref: "user",
      require: true,
    },
    jobtitle:{
      type: String,
      required: true,
    },
    responsibilites:{
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    resume: {
      type: String, 
      required: true,
    },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Under Review', 'Accepted', 'Rejected']
    },
    feedback: {
      type: String,
    },
    reviewerId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    approverId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true } 
);

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;
