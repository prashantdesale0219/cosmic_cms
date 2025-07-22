import nodemailer from 'nodemailer';
import config from '../config/config.js';

// Send email utility function
const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: config.emailService,
    auth: {
      user: config.emailUser,
      pass: config.emailPass
    }
  });

  // Define email options
  const mailOptions = {
    from: `Cosmic Powertech Solutions <${config.emailUser}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
    text: options.text
  };

  // Add CC if provided
  if (options.cc) {
    mailOptions.cc = options.cc;
  }

  // Add BCC if provided
  if (options.bcc) {
    mailOptions.bcc = options.bcc;
  }

  // Add attachments if provided
  if (options.attachments) {
    mailOptions.attachments = options.attachments;
  }

  // Send email
  const info = await transporter.sendMail(mailOptions);
  return info;
};

export default sendEmail;