const nodemailer = require("nodemailer");
const dotenv = require('dotenv');

dotenv.config();

const sendMail = async (email,password) => {
    const mailOptions = {
        from: "sreenandhanpp@gmail.com",
        to: email,
        subject: "Find Your Username And Password",
        html: `<p>Password: <b>${password}</b><br>
         this is your job portal password</b>.</p>`,
      };

      // Create a transporter for sending emails using nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASS,
        },
      });
      // Send the OTP verification email
      await transporter.sendMail(mailOptions);
}

module.exports = sendMail