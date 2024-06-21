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
        res.status(200).send({ message: 'Your message send successfully' })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }

}