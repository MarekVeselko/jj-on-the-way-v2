import e, { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Email, EmailModel } from '../models/email.model';
const nodemailer = require("nodemailer");

const router = Router();


router.post("/sendmail", (req, res) => {
    let email = req.body;
    sendMail(email, (info: any) => {
        // console.log(`The mail has beed send 😃 and the id is ${info.messageId}`);
        res.send(info);
      });
});

async function sendMail(email: Email, callback:any) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "jjontheway.travelblog@gmail.com",
        pass: process.env.EMAIL_PASSWORD!.toString(),
      }
    });
  
    let mailOptions = {
      from: email.email, // sender address
      to: "jjontheway.travelblog@gmail.com", // list of receivers
      subject: email.contactReason.toString(), // Subject line
      html: `<h4>Meno: ${email.name + ' ' + (email.surname || '')}</h4><br>
      <h4>E-mail : ${email.email}</h4>
      <p> ${email.text}</p>`
    };
  
    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
  
    callback(info);
  }


export default router;