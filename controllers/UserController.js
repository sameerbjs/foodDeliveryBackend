import User from "../model/user.js"
import bcrypt from "bcrypt";
import { generateToken, generateVerificationToken } from "../helper/token.js";
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'sabirsameer48@gmail.com',
    pass: 'kdjpepycjjolyyiy',
  },
});

export const userRegister = async (req, res) => {
  const { name, email, address, password, isUser, dob, profilePic } = req.body;
  const chkExsit = await User.findOne({ email });
  if (chkExsit) {
    return res
      .status(400)
      .send({ error: "User already registered with this email" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name: name,
      email: email,
      address: address,
      isUser: isUser,
      password: hashedPassword,
      profilePic: profilePic,
      dob: dob,
      verificationToken: null,
      verificationUrl: null,
      isVerified: true
    });

    await user.save()

    res.status(200).send({ message: "User registered Successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: "User dose'nt registered" })
  }
};

export const UserEmailVerification = async (req, res) => {
  try {
    // Find the user in the database based on the verification token
    const user = await User.findOne({ verificationToken: req.query.token });

    if (!user) {
      return res.status(404).send({ error: 'User with provided email is not registered' });
    }

    // Update the user record to mark them as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationUrl = null
    await user.save();

    res.status(200).send({ message: 'Email verified successfully you can login now' });
  } catch (error) {
    res.status(500).send({ error: 'Email not verify' });
  }
}

export const userLogin = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const match = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (match) {
      res.status(200).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isUser: user.isUser,
        profilePic: user.profilePic,
        address : user.address,
        dob: user.dob,
        profilePath: user.profilePath,
        isVerified: user.isVerified,
        verificationUrl: user.verificationUrl,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).send({ error: "Invalid credentials" });
    }
  } else {
    return res.status(400).send({ error: "User dose not exsist" });
  }
};

export const getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export const userEdit = async (req, res) => {

  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    let { name, email, address, dob, password, isUser, current_password, profilePic } = req.body;

    if (current_password) {
      const match = await bcrypt.compare(
        req.body.current_password,
        user.password
      );
      if (!match) {
        return res.status(500).send({ error: "Current password is wrong" });
      }
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        address,
        password,
        dob,
        isUser,
        profilePic
      },
      { new: true }
    );

    const finalData = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      address: updatedUser.address,
      isUser: updatedUser.isUser,
      dob: updatedUser.dob,
      profilePic: updatedUser.profilePic,
      isVerified: updatedUser.isVerified,
      token: generateToken(updatedUser._id),
    }

    res.status(200).send({ finalData });
  } catch (error) {
    res.status(500).send({ error: "Failed to update user" });
  }
}