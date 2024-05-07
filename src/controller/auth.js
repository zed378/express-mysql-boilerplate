const { Users } = require("../../models");
const { Op } = require("sequelize");

const bcrypt = require("bcrypt");
const saltRounds = 12;
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const { inputValidation } = require("../middleware/inputValidation");

// package and config for sending email
const nodemailer = require("nodemailer");
const fs = require("fs");
const mustache = require("mustache");
const template = fs.readFileSync(__dirname + "/template/template.html", "utf8");
const templateOTP = fs.readFileSync(__dirname + "/template/otp.html", "utf8");
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

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const { error } = inputValidation.validate({
      firstName,
      lastName,
      email,
      password,
    });

    if (error) {
      return res.send({
        status: "Error",
        message: error.details[0].message,
      });
    }

    const isUserExist = await Users.findOne({
      where: {
        email,
      },
    });

    isUserExist &&
      res.status(400).send({
        status: "Error",
        message: "You already registered",
      });

    !isUserExist &&
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hashed) => {
          Users.create({
            firstName,
            lastName,
            email,
            password: hashed,
          })
            .then((result) => {
              const options = {
                from: process.env.MAIL_USER,
                to: email,
                subject: "Success Registration",
                html: mustache.render(template, {
                  firstName: firstName,
                  lastName: lastName,
                  link: `${process.env.HOST_URL}/auth/activation?p=${result.id}`,
                }),
              };

              transporter.sendMail(options, async (err, info) => {
                !err &&
                  res.status(200).send({
                    status: "Success",
                    message:
                      "Successfully register. Check your mailbox to activate your account.",
                  });

                err &&
                  res.send({
                    status: "Error",
                    message: {
                      error: err,
                      solution:
                        "Failed to sending activation email. Contact your administrator for help.",
                    },
                  });
              });
            })
            .catch((err) => {
              res.status(400).send({
                status: "Error",
                message: err,
              });
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

exports.login = async (req, res) => {
  try {
    const { user, password } = req.body;

    const { error } = await inputValidation.validate({ user, password });

    if (error) {
      return res.send({
        status: "Error",
        message: error.details[0].message.includes("types")
          ? "username length must be at least 3 characters long or email must be valid email."
          : error.details[0].message,
      });
    }

    const isUserExist = await Users.findAll({
      where: {
        [Op.or]: [{ username: user }, { email: user }],
      },
      attributes: {
        exclude: ["updatedAt"],
      },
    });

    if (isUserExist.length === 0) {
      return res.status(400).send({
        status: "Error",
        message: "You're not registered",
      });
    }

    if (isUserExist[0].dataValues.isActive === false) {
      return res.status(400).send({
        status: "Error",
        message:
          "Activate your account before you login. Please, open your mailbox.",
      });
    }

    const token = jwt.sign(
      {
        id: isUserExist[0].dataValues.id,
        firstName: isUserExist[0].dataValues.firstName,
        lastName: isUserExist[0].dataValues.lastName,
        email: isUserExist[0].dataValues.email,
        role: isUserExist[0].dataValues.role,
      },
      secret,
      {
        expiresIn: 60 * 60 * 24 * 2,
      }
    );

    const data = {
      id: isUserExist[0].dataValues.id,
      firstName: isUserExist[0].dataValues.firstName,
      lastName: isUserExist[0].dataValues.lastName,
      email: isUserExist[0].dataValues.email,
      role: isUserExist[0].dataValues.role,
      username: isUserExist[0].dataValues.username,
      picture: isUserExist[0].dataValues.picture,
      isActive: isUserExist[0].dataValues.isActive,
      join: isUserExist[0].dataValues.createdAt,
    };

    isUserExist.length !== 0 &&
      isUserExist[0].dataValues.isActive == true &&
      bcrypt.compare(
        password,
        isUserExist[0].dataValues.password,
        async function (err, result) {
          (!result || err) &&
            res.status(400).send({
              status: "Error",
              message: "Email or Username or Password incorrect",
            });

          result &&
            res.status(200).send({
              status: "Success",
              message: "Login Success",
              token,
              data,
            });
        }
      );
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.activation = async (req, res) => {
  try {
    const { p } = req.query;

    const isActive = await Users.findOne({ where: { id: p } });

    if (!isActive.dataValues.isActive) {
      const isUserExist = await Users.update(
        { isActive: true },
        { where: { id: p } }
      );

      isUserExist[0] === 1 && res.status(200).redirect(process.env.FE_URL);
      isUserExist[0] === 0 &&
        res.status(400).send({
          status: "Error",
          message: "Your account failed to activate",
        });
    } else {
      res.status(400).send({
        status: "Error",
        message: "You already activate your account!",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = inputValidation.validate({
      email,
    });

    if (error) {
      return res.send({
        status: "Error",
        message: error.details[0].message,
      });
    }

    function getRandomInt() {
      return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    }

    const otp = getRandomInt();

    const otpToken = jwt.sign(
      {
        message: "No Data provide.",
      },
      secret,
      {
        expiresIn: 60 * 5,
      }
    );

    const isUserExist = await Users.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    !isUserExist &&
      res.status(400).send({
        status: "Error",
        message: "Make sure you already registered",
      });

    const options = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "OTP for reset password",
      html: mustache.render(templateOTP, {
        firstName: isUserExist?.dataValues?.firstName,
        lastName: isUserExist?.dataValues?.lastName,
        otp: otp,
      }),
    };

    isUserExist &&
      (await Users.update(
        { otp, otpToken },
        {
          where: { id: isUserExist.id },
        }
      )) &&
      transporter.sendMail(options, (err, info) => {
        err &&
          res.status(400).send({
            status: "Error",
            message: {
              error: err,
              solution:
                "Failed to sending email. Contact your administrator for help.",
            },
          });

        !err &&
          res.status(200).send({
            status: "Success",
            message:
              "Yor OTP has been sent. Check your email. If not exist in inbox search on spam.",
          });
      });
  } catch (error) {
    res.status(400).send({ status: "Error", message: "Failed to send OTP" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    const { error } = inputValidation.validate({
      email,
    });

    if (error) {
      return res.send({
        status: "Error",
        message: error.details[0].message,
      });
    }

    const isUserExist = await Users.findOne({ where: { email } });

    isUserExist &&
      jwt.verify(isUserExist.otpToken, secret, async (err, decoded) => {
        if (err) {
          await Users.update(
            { otp: 101010, otpToken: null },
            {
              where: { id: isUserExist.id },
            }
          ).then(() => {
            return res.status(400).send({
              message: "Expired OTP",
            });
          });
        }

        if (!err) {
          otp === 101010 &&
            (await Users.update(
              { otp: 101010, otpToken: null },
              {
                where: { id: isUserExist.id },
              }
            ).then(() => {
              return res.status(400).send({
                status: "Error",
                message:
                  "Make sure you succeed request OTP. Try request new OTP.",
              });
            }));

          otp !== isUserExist.otp &&
            (await Users.update(
              { otp: 101010, otpToken: null },
              {
                where: { id: isUserExist.id },
              }
            ).then(() => {
              return res.status(400).send({
                status: "Invalid",
                message: "Your OTP is invalid. Try request new OTP.",
              });
            }));

          if (otp === isUserExist.otp) {
            const updateOTP = await Users.update(
              { otp: 101010, otpToken: null },
              {
                where: { id: isUserExist.id },
              }
            );

            updateOTP[0] === 1 &&
              bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                  const updatePass = await Users.update(
                    { password: hash },
                    {
                      where: { id: isUserExist.id },
                    }
                  );
                  updatePass[0] === 1 &&
                    res.status(200).send({
                      status: "Success",
                      message:
                        "Your password successfully updated. Now you can login with your new password.",
                    });

                  updatePass[0] === 0 &&
                    res.status(400).send({
                      status: "Error",
                      message: "Failed to reset password",
                    });
                });
              });
          }
        }
      });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.verify = async (req, res) => {
  try {
    const id = req.user.id;

    await Users.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["updatedAt", "password", "otp", "otpToken"],
      },
    }).then((data) => {
      console.log(data?.id);
      const token = jwt.sign(
        {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
        },
        secret,
        {
          expiresIn: 60 * 60 * 24 * 2,
        }
      );

      const datas = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        username: data.username,
        picture: data.picture,
        isActive: data.isActive,
        join: data.createdAt,
      };

      data &&
        res.status(200).send({
          status: "Success",
          message: "Success verify token and refreshed token",
          token,
          data: datas,
        });

      !data &&
        res.status(404).send({
          status: "Failed",
          message: "You're not registered",
        });
    });
  } catch (error) {
    res.status(200).send({
      status: "Failed",
      message: error.message,
    });
  }
};
