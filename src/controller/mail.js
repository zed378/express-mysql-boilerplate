const nodemailer = require("nodemailer");
const fs = require("fs");
const mustache = require("mustache");
const template = fs.readFileSync(__dirname + "/template/contact.html", "utf8");
const templateMsg = fs.readFileSync(
  __dirname + "/template/message.html",
  "utf8"
);
const transporter = nodemailer.createTransport({
  // service: "hotmail",
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true,
  // service is depends on webserver, hotmail means i am using outlook
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

exports.contactUs = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    const optClient = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Success Sending Message",
      html: mustache.render(template, {
        firstName,
        lastName,
      }),
    };

    const optServer = {
      from: process.env.MAIL_USER,
      to: "contact@webcompose.id, eva@webcompose.id",
      subject: `New Message from ${firstName} ${lastName}`,
      html: mustache.render(templateMsg, {
        firstName,
        lastName,
        email,
        phone,
        message,
      }),
    };

    transporter.sendMail(optServer, async (err, info) => {
      err &&
        res.send({
          status: "Error",
          message: {
            error: err,
            solution:
              "Failed to sending server email. Contact your administrator for help.",
          },
        });

      !err &&
        transporter.sendMail(optClient, async (error, ingfo) => {
          error &&
            res.send({
              status: "Error",
              message: {
                error: err,
                solution:
                  "Failed to sending client email. Contact your administrator for help.",
              },
            });

          !error &&
            res.status(200).send({
              status: "Success",
              message: "Successfully Sending Email",
            });
        });
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};
