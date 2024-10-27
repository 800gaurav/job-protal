import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
   
    password: {
      type: String,
      required: true,
    },
    applications:[
     {
        type: mongoose.Types.ObjectId,
        ref: "JobApplication",
      }
    ],
   role:{
      type:String,
      default: "initiator",
      enum:["initiator", "reviewer", "approver"],
    }
  },
  { timestamps: true }
);

const user = mongoose.model("user", userschema);

export default user;