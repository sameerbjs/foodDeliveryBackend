import User from "../model/user.js"
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

export const userRegister = async (req, res) => {
    const { name, email, address, password, isUser } = req.body;

    const chkExsit = await User.findOne({ email });
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
            .send({ error: "User already registered with this email" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = generateVerificationToken();
        const verificationUrl = `${process.env.LIVE_SITE_URL}/verify-user?token=${verificationToken}`
        const user = new User({
            name: name,
            email: email,
            address: address,
            isUser: isUser,
            password: hashedPassword,
            profilePic: req.file.filename,
            profilePath: req.file.path,
            verificationToken: verificationToken,
            verificationUrl: verificationUrl,
            isVerified: false
        });

        await user.save()

        const emailMessage = {
            from: 'sabirsameer48@gmail.com',
            to: user.email,
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
                                href="${process.env.LIVE_SITE_URL}/verify-user?token=${verificationToken}"
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
        res.status(200).send({ error: "User dose'nt registered" })
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