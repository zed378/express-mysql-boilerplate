const { Users } = require("../../models");
const { Op } = require("sequelize");
const { Up, Down } = require("../../config/migrate");

exports.migrate = async (req, res) => {
  try {
    Up();

    res.status(200).send({
      status: "Success",
      message: "Database table migrate success",
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.dropTable = async (req, res) => {
  try {
    Down();

    res.status(200).send({
      status: "Success",
      message: "Database table drop successfully",
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.seeding = async (req, res) => {
  try {
    await Users.bulkCreate([
      {
        username: "zed",
        firstName: "Muhammad",
        lastName: "Zawawi",
        email: "zawawi@webcompose.id",
        password:
          "$2b$12$e1ysT65hI0bzUhO5CgBwneK7xjp55Thre5cONKI.aWaPTcreiKHEe", // 123123
        isActive: true,
        role: "SYS",
      },
      {
        username: "eva",
        firstName: "Eva",
        lastName: "Rahayu",
        email: "eva@webcompose.id",
        password:
          "$2b$12$e1ysT65hI0bzUhO5CgBwneK7xjp55Thre5cONKI.aWaPTcreiKHEe", // 123123
        isActive: true,
        role: "ADMIN",
      },
    ])
      .then(() =>
        res.status(200).send({
          status: "Success",
          message: "Seeding success",
        })
      )
      .catch((err) =>
        res.status(400).send({
          status: "Error",
          message: err.message,
        })
      );
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.unseeding = async (req, res) => {
  try {
    await Users.destroy({
      where: {
        email: { [Op.in]: ["zawawi@webcompose.id", "eva@webcompose.id"] },
      },
    })
      .then(() =>
        res.status(200).send({
          status: "Success",
          message: "Unseeding success",
        })
      )
      .catch((err) =>
        res.status(400).send({
          status: "Error",
          message: err.message,
        })
      );
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.deactiveAll = async (req, res) => {
  try {
    await Users.update({ isActive: false }, { where: { isActive: true } })
      .then(() => {
        res.status(200).send({
          status: "Success",
          message: "Successfully deactivate all account",
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: "Error",
          message: err.message,
        });
      });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.activateAll = async (req, res) => {
  try {
    await Users.update({ isActive: true }, { where: { isActive: false } })
      .then(() => {
        res.status(200).send({
          status: "Success",
          message: "Successfully activate all account",
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: "Error",
          message: err.message,
        });
      });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};
