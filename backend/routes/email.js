const nodemailer = require('nodemailer');
require('dotenv').config();

function sendEmail(email, url) {
  //Mail settings
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  //send email
  let mailOptions = {
    from: 'taskplanner.pgjk@gmail.com',
    to: email,
    subject: 'Confirm Email',
    html: `Thank you for creating an account in our app. <br/> Please click this link to confirm your email: <a href="${url}">${url}</a>`,
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log('Error Occurs: ', err);
    } else {
      console.log('Email sent!');
    }
  });
}

exports.sendEmail = sendEmail;
