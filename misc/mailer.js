const nodemailer = require('nodemailer');
const mailer_config = require('../config/mailer_config');

const transport = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: mailer_config.MAILGUN_USER,
    pass: mailer_config.MAILGUN_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = {
  sendEmail(from, to, subject, html){
    return new Promise((resolve, reject) => {
      transport.sendMail({from, to, subject, html}, (err, info) => {
        if (err){
          reject(err);
        }
          resolve(info);
        });
      });
    }
  }
