import Resturant from "../model/resturant.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { generateToken, generateVerificationToken } from "../helper/token.js";
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'sabirsameer48@gmail.com',
    pass: 'kdjpepycjjolyyiy',
  },
});

export const resturantRegister = async (req, res) => {
  const { name, email, city, address, password, phone, isUser } = req.body;

  const chkExsit = await Resturant.findOne({ email });
  const filePath = path.join(req.file.path);
  if (chkExsit) {
    fs.unlink(filePath, (err) => {
      if (err)
        return res.status(400).send({
          error: "File cannot be deleted chkExsist",
        });
    });
    return res
      .status(400)
      .send({ error: "Resturant already registered with this email" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = generateVerificationToken()
    const rest = new Resturant({
      name: name,
      email: email,
      city: city,
      address: address,
      isUser: isUser,
      phone: phone,
      password: hashedPassword,
      profilePic: req.file.filename,
      profilePath: req.file.path,
      verificationToken: verificationToken,
      isVerified: false
    });

    await rest.save()

    const emailMessage = {
      from: 'sabirsameer48@gmail.com',
      to: rest.email,
      subject: 'Email Verification',
      html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <style>
                  @media only screen and (max-width: 600px) {
                    .container {
                      width: 100% !important;
                    }
                    .content {
                      padding: 20px !important;
                    }
                  }
                </style>
              </head>
            
              <body style="margin: 0; padding: 0;">
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  width="600"
                  style="border-collapse: collapse;"
                >
                  <tr>
                    <td
                      align="center"
                      bgcolor="#212245"
                      style="
                        padding: 40px 0 30px 0;
                        color: #ffffff;
                        font-size: 28px;
                        font-weight: bold;
                        font-family: Arial, sans-serif;
                      "
                    >
                      Rapid Cravings Email Verification
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      bgcolor="#ffffff"
                      style="padding: 40px 30px 40px 30px;"
                    >
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="border-collapse: collapse; max-width: 600px;"
                      >
                        <tr>
                          <td
                            align="center"
                            style="
                              font-family: Arial, sans-serif;
                              font-size: 24px;
                              font-weight: bold;
                              color: #212245;
                            "
                          >
                            Thank you for registering with Rapid Cravings!
                          </td>
                        </tr>
                        <tr>
                          <td
                            align="center"
                            style="
                              padding: 20px 0 30px 0;
                              font-family: Arial, sans-serif;
                              font-size: 16px;
                              color: #212245;
                            "
                          >
                            Please click the button below to verify your email address:
                          </td>
                        </tr>
                        <tr>
                          <td align="center">
                            <a
                              href="${process.env.LIVE_SITE_URL}/verify?token=${verificationToken}"
                              target="_blank"
                              style="
                                background-color: #f87171;
                                border: none;
                                color: #ffffff;
                                padding: 15px 25px;
                                text-align: center;
                                text-decoration: none;
                                display: inline-block;
                                font-size: 16px;
                                font-family: Arial, sans-serif;
                                font-weight: bold;
                                border-radius: 4px;
                                transition: background-color 0.3s ease;
                              "
                              >Verify Email</a
                            >
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      bgcolor="#212245"
                      style="
                        padding: 30px;
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        color: #ffffff;
                      "
                    >
                      &copy; 2023 Rapid Cravings. All rights reserved.
                    </td>
                  </tr>
                </table>
              </body>
            </html>
            
            `,
    };

    await transporter.sendMail(emailMessage);

    res.status(200).send({ message: "Verification Email Sent Please Verify" })
  } catch (error) {
    res.status(200).send({ error: "Resturant dose'nt registered" })
  }
};

export const resturantEmailVerification = async (req, res) => {
  try {
    // Find the user in the database based on the verification token
    const rest = await Resturant.findOne({ verificationToken: req.query.token });

    if (!rest) {
      return res.status(404).send({ error: 'Resturant with provided email is not registered' });
    }

    // Update the user record to mark them as verified
    rest.isVerified = true;
    rest.verificationToken = null;
    await rest.save();

    res.status(200).send({ message: 'Email verified successfully you can login now' });
  } catch (error) {
    res.status(500).send({ error: 'Email not verify' });
  }
}

export const resturantLogin = async (req, res) => {
  const restFind = await Resturant.findOne({ email: req.body.email });
  if (restFind) {
    const match = await bcrypt.compare(
      req.body.password,
      restFind.password
    );

    if (match) {
      res.status(200).send({
        _id: restFind._id,
        name: restFind.name,
        email: restFind.email,
        isUser: restFind.isUser,
        profilePic: restFind.profilePic,
        profilePath: restFind.profilePath,
        isVerified: restFind.isVerified,
        token: generateToken(restFind._id),
      });
    } else {
      return res.status(400).send({ error: "Invalid credentials" });
    }
  } else {
    return res.status(400).send({ error: "Resturant dose not exsist" });
  }
};

export const getresturantDetail = async (req, res) => {
  try {
    const resturant = await Resturant.findById(req.params.id);
    return res.status(200).send(resturant);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export const resturantEdit = async (req, res) => {

  try {
    const { id } = req.params;
    const resturant = await Resturant.findById(id);
    if (!resturant) {
      return res.status(404).send({ error: "Resturant not found" });
    }

    let { name, email, city, address, password, phone, isUser, current_password } = req.body;
    const profilePath = req.file ? req.file.path : resturant?.profilePath;
    const profilePic = req.file ? req.file.filename : resturant?.profilePic;
    if (req.file) {
      const filePath = path.join(resturant?.profilePath);
      fs.unlink(filePath, (err) => {
        if (err)
          return res.status(400).send({
            error: "File cannot be deleted edit resturant",
          });
      });
    }

    if (current_password) {
      const match = await bcrypt.compare(
        req.body.current_password,
        resturant.password
      );
      if (!match) {
        return res.status(500).send({ error: "Current password is wrong" });
      }
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }

    const updatedResturant = await Resturant.findByIdAndUpdate(
      id,
      {
        name,
        email,
        city,
        address,
        password,
        phone,
        isUser,
        profilePath,
        profilePic
      },
      { new: true }
    );

    res.status(200).send({ data: updatedResturant, message : 'Resturant update successfully' });
  } catch (error) {
    res.status(500).send({ error: "Failed to update resturant" });
  }
}