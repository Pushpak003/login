const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendBlockMail = async (
  email,
  resetLink
) => {

  const info = await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: email,

    subject: "Reset Password",

    html: `
      <h2>Account Blocked</h2>

      <p>
        Click below to reset your password:
      </p>

      <a href="${resetLink}">
        Reset Password
      </a>
    `
  });

  console.log(info.response);
};

module.exports = sendBlockMail;