// OKAY
const nodemailer = require('nodemailer');

const Transport = nodemailer.createTransport({
  host: 'mail.trin-innovation.com.netsolmail.net',
  port: 587,
  auth: {
    user: 'info@trin-innovation.com',
    pass: 'T59j@9j0gw690j',
    // Mwjwy45@trin
  },
  logger: true,
  debug: true,
  secureConnection: 'false',
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  },
});

// const host = `http://localhost:3000`;
const host = `http://trin-innovation.com`;

module.exports.passwordResetMail = async (email, type) => {
  const mailBody = ` <strong>Dear User</strong>
  <br>
  Seems like you just forgot your password.
  <br>
  Click on the link to reset your password.<br>
  <a href="http://bad-blogger.herokuapp.com/admin/reset_password?email=${email}&usertype=${type}"><b>Reset Page<b></a>
   <br> 
   Nice day!`;
  let mailOptions = {
    from: 'manager@trin-innovation.com',
    to: email,
    subject: 'Moner Shastho - Password reset link',
    html: mailBody,
  };

  return await Transport.sendMail(mailOptions);
};

module.exports.clientFeedback = async (obj) => {
  const {
    name,
    email,
    msg
  } = obj

  const mailBody = `Name: ${name} <br>
  Email: ${email} <br>
  Message: ${msg}`;
  let mailOptions = {
    from: 'manager@trin-innovation.com',
    to: 'zaidfarzan@aol.com ',
    subject: 'Moner Shastho - Client feedback',
    html: mailBody,
  };

  return await Transport.sendMail(mailOptions);
};

