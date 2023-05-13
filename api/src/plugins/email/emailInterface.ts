import * as nodemailer from 'nodemailer';
// Create a Mailgun SMTP transport.
let emailInterface = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'emmitt.windler74@ethereal.email',
    pass: 'dvRFf4j4X56fZJ4D3Y',
  },
});

export default emailInterface;
