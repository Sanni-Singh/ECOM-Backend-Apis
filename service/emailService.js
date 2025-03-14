const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // Hostname of SMPT Server (smtp.gmail.com)
  port: process.env.SMTP_PORT, // Port of SMTP Server
  secure: false,
  // tls: {
  //     // Put your gmail credentials
  // }
});

const sendEmail = ({ toEmail, subject, orderDetails }) => {
  const mailOptions = {
    from: "do-not-reply@myecommstore.com",
    to: toEmail,
    subject: subject,
    // text: "Test email body jdflkaj dflkja slkdfjaslkdfjas ldkfjasl; dfjasdlf jkasdlf;jasdl d"
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h1>First email heading</h1>
            <p style="color: blue; font-size: 25px;">ajslkdf jlaksdjf lsdjf lasdjf lasdjf lsadjf lsadf</p>
            <a href="https://google.com" target="_blank"> Click here</a>
            <table>
                <thead>
                    <tr>
                        <th>F Name</th>
                        <th>L Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>ABCD</td>
                        <td>XYZZ</td>
                    </tr>
                </tbody>
            </table>
              <img height="500" width="200" src="https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwxMDY1OTc2fHxlbnwwfHx8fHw%3D" />
              ${orderDetails.productName} <br/>
              ${orderDetails.orderId}
        </body>
        </html>
    `,
  };

  mailer.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("ERROR SENDING EMAIL", err);
      return;
    }
    console.log("EMAIL SENT SUCCESSFULLY", info);
  });
};

module.exports = sendEmail;