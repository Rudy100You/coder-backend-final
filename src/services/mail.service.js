import nodemailer from "nodemailer";
const {GOOGLE_APPKEY, GOOGLE_MAIL_SENDER} = process.env;
export class MailService {
    constructor() {
      if (!MailService.instance) {
        // If an instance doesn't exist, create a new one
        this.transport = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
              user: GOOGLE_MAIL_SENDER,
              pass: GOOGLE_APPKEY,
            },
          });
        MailService.instance = this; // Assign the instance to a static property
      }
  
      return MailService.instance; // Return the existing instance
    }
  
    // Example method
    getTransport() {
      return this.transport;
    }
  }