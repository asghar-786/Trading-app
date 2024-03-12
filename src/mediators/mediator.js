const nodemailer = require("nodemailer");
const { logger } = require("../../logger");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const sendVerificationEmail = async (email, verificationToken,name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: "fa21bscs0017@maju.edu.pk",
      to: email,
      subject: "Email Verification",
      html: `<h3>Hello ${name}</h3>
      <p>Click the Link to Verify Your Account</p>
      <a href="http://${process.env.SERVER_HOST}:${process.env.PORT}/verify-email?email=${encodeURIComponent( email)}&verificationToken=${verificationToken}">Verify your email</a>`,
   
    };

    await transporter.sendMail(mailOptions);

    logger.info(`Verification email sent successfully to ${email}.`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

const passwordVerify = async (password, existingUser) => {
  try {
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    console.log("Password Match ", passwordMatch);
    console.log("Existing User", existingUser);

    if (passwordMatch) {
      const investerpayload = {
        id: existingUser.id,
        name: existingUser.name,
        password: existingUser.password,
        profession: existingUser.profession,
      };

      console.log("Investor Payload", investerpayload);
      const token = jwt.sign(investerpayload, process.env.JWT_SECRET);
      console.log("Token", token);

      const option = {
        headers: {
          "Set-Cookie": cookie.serialize("token", token, {
            httpOnly: true,
          }),
        },
      };
      console.log("Options", option);

      return "Login Success";
    }
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
};

module.exports = { sendVerificationEmail, passwordVerify };
