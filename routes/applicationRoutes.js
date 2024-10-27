import express from "express";
import { authorizeUser } from "../middleware/usermiddleware.js";
import { applyJobApplication, approveApplicationController, getAllJobApplications, getapplicationByapprover, getApprovers, getJobapplicationbyid, reviewApplicationController, sendapproverController } from "../controllers/applicationController.js";
import upload from "../config/multer.js";
const router = express.Router();

router.post('/apply', authorizeUser, upload.single('resume'), applyJobApplication )
router.get('/allapplication', authorizeUser, getAllJobApplications )
router.get('/singleapplication', authorizeUser, getJobapplicationbyid )
router.get('/getapprover', getApprovers )
router.post('/sendapplication/:applicationId', authorizeUser, sendapproverController)
router.get('/getbyapprover', authorizeUser, getapplicationByapprover)
router.post('/review/:applicationId', authorizeUser, reviewApplicationController)
router.post('/approver/:applicationId', authorizeUser, approveApplicationController)

export default router