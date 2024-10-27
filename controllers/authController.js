import user from '../models/user.js'
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";


export const signupController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
      return res.status(500).send({
        success: false,
        message: "please provide all fields",
      });
    }
    const exisiting = await user.findOne({ email });
    if (exisiting) {
      return res.status(200).send({
        success: true,
        message: "Email Already Registerd",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const users = await user.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).send({
      success: true,
      message: "Successfully Registered",
      users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in registeration",
      error,
    });
  }
};



// logincontroller

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "please fill  email and password",
      });
    }
    const users = await user.findOne({ email });
    if (!users) {
      return res.status(404).send({
        seccess: true,
        message: "invalid email id",
      });
    }

  
  const isMatch = bcrypt.compareSync(password, users.password);
    if (!isMatch) {
      return res.status(404).send({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = JWT.sign({ id: users._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      users,
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error while login",
      error,
    });
  }
};

