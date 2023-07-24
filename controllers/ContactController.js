import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'sabirsameer48@gmail.com',
        pass: process.env.GMAIL_PASS,
    },
});

export const handleContactUs = async (req, res) => {

    try {
        const { name, email, message } = req.body;
        const emailMessage = {
            from: 'sabirsameer48@gmail.com',
            to: 'sabirsameer48@gmail.com',
            subject: 'Email Verification',
            html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Contact Us Form Submission</title>
                        <style>
                            body {
                                margin: 0;
                                padding: 0;
                                font-family: Arial, sans-serif;
                            }
                    
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #f8f8f8;
                                padding: 20px;
                                border-radius: 5px;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            }
                    
                            h1 {
                                color: #212245;
                                margin-bottom: 20px;
                            }
                    
                            p {
                                color: #333;
                                line-height: 1.6;
                            }
                    
                            .footer {
                                text-align: center;
                                color: #999;
                                padding-top: 20px;
                            }
                    
                            @media screen and (max-width: 600px) {
                                .container {
                                    padding: 10px;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Contact Us Form Submission</h1>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Message:</strong> ${message}</p>
                        </div>
                    
                        <div class="footer">
                            <p>Thanks for your support.</p>
                        </div>
                    </body>
                    </html>
                  `,
        };
        await transporter.sendMail(emailMessage);
        res.status(200).send({ message: 'Your message send successfully' })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }

}