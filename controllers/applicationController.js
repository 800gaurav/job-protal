import JobApplication from '../models/jobapply.js'
import user from '../models/user.js';

// Create a new job application
export const applyJobApplication = async (req, res) => {
  try {
    const {id} = req.headers
    const {jobtitle, responsibilites, name, education, phone, experience } = req.body;
    const resume = req.file ? `/uploads/${req.file.filename}` : '';
  
    const users = await user.findById(id)
    if (!users) {
        return res.status(404).send({ message: "User not found" });
      }

    // Check if all fields are provided
    if (!name || !education || !phone || !experience || !resume) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields including resume upload.",
      });
    }

    const jobApplication = new JobApplication({
      ofUser: id,
      jobtitle,
      responsibilites,
      name,
      education,
      phone,
      experience,
      resume,
    });

    await jobApplication.save();

    res.status(201).send({
      success: true,
      message: "Application submitted successfully.",
      jobApplication,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error submitting application",
      error,
    });
  }
};

// Get all job applications
export const getAllJobApplications = async (req, res) => {
    try {
      const { id } = req.headers; 
      const users = await user.findById(id);
      
      // Check if the user exists
      if (!users) {
        return res.status(404).send({ message: "User not found" });
      }
  
      // Check if the user has the 'reviewer' role
      if (users.role === "reviewer") {
        const applications = await JobApplication.find({}).sort({ createdAt: -1 });
        return res.status(200).send({
          success: true,
          message: "All applications retrieved successfully",
          applications,
        });
      } else {
        return res.status(403).send({ message: "Access denied. Only reviewers can view applications." });
      }
    } catch (error) {
      console.error("Error retrieving applications:", error); 
      res.status(500).send({
        success: false,
        message: "Error retrieving applications",
        error,
      });
    }
  };

// Get a single job application by ID
export const getJobapplicationbyid = async (req, res) => {
  try {
    const { id } = req.headers; 

    const applications = await JobApplication.find({ ofUser: id }).sort({name: 1});

    if (!applications) {
      return res.status(404).send({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Application find successfully",
      applications,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error retrieving application",
      error,
    });
  }
};


export const getApprovers = async (req, res) => {
    try {
     
      const approvers = await user.find({ role: "approver" })
  
      
      if (!approvers) {
        return res.status(404).send({
          success: false,
          message: "No approvers found.",
        });
      }
  
     
      res.status(200).send({
        success: true,
        message: "Approvers retrieved successfully.",
        approvers,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error retrieving approvers.",
        error,
      });
    }
  };


export const sendapproverController = async (req, res) => {
    try {
        const { approverId } = req.body;  
        const { applicationId } = req.params
        const { id } = req.headers; 

    
        const admin = await user.findById(id);
        if (admin.role === "reviewer") {
            const approver = await user.findById(approverId);
         if (!approver) {
                return res.status(404).send({
                    success: false,
                    message: "approver not found.",
                });
            }

           
            if (!approver.applications.includes(applicationId)) {
                approver.applications.push(applicationId);
                await approver.save();
            }

           

            return res.status(200).send({
                success: true,
                message: "application shared successfully with the approver.",
                approver,
            });
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while sharing application to approver.",
            error,
        });
    }
};


export const getapplicationByapprover = async(req, res)=>{
    try {
        const { id } = req.headers; 
        
        const approver = await user.findById(id).populate('applications');

        if (!approver) {
            return res.status(404).send({
                success: false,
                message: "approver not found.",
            });
        }

    
        return res.status(200).send({
            success: true,
            message: "application fetched successfully.",
            application : approver.applications, 
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while fetching application.",
            error,
        });
    }

};


export const reviewApplicationController = async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { feedback, status } = req.body;
      const { id } = req.headers; 
  
      
      const application = await JobApplication.findById(applicationId);
      if (!application) {
        return res.status(404).send({ message: "Application not found" });
      }
  
     
      const reviewer = await user.findById(id);
      if (reviewer.role !== "reviewer") {
        return res.status(403).send({ message: "Access denied. Only reviewers can give feedback or reject applications." });
      }
  
     
      application.feedback = feedback;
      application.status = status;
      application.reviewerId = reviewer._id;
      await application.save();
  
      res.status(200).send({
        success: true,
        message: "Feedback submitted successfully.",
        application,
      });

    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error submitting feedback",
        error,
      });
    }
  };
  
  
  export const approveApplicationController = async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { status, feedback } = req.body;
      const { id } = req.headers;
  
     
      const application = await JobApplication.findById(applicationId);
      if (!application) {
        return res.status(404).send({ message: "Application not found" });
      }
  

      const approver = await user.findById(id);
      if (approver.role !== "approver") {
        return res.status(403).send({ message: "Access denied. Only approvers can approve or reject applications." });
      }
  
   
      application.status = status 
      application.feedback = feedback
      application.approverId = approver._id;
      await application.save();
  
      res.status(200).send({
        success: true,
        message: "Application processed successfully by approver.",
        application,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error processing application",
        error,
      });
    }
  };
  