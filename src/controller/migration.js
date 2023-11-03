const { Users, Status, Platform } = require("../../models");
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
      .then(() => {
        Status.bulkCreate([
          {
            id: "3d060548-be58-466f-a576-36334c437679",
            name: "APPROACHING",
          },
          {
            id: "9cc278cd-c50b-4600-aa3d-2300ee096cbc",
            name: "MEETING",
          },
          {
            id: "b8613e66-09e7-450c-b03b-ff02de64ca44",
            name: "QUOTATION SENT",
          },
          {
            id: "2a6ddff6-6ea7-4019-a78c-8062c2e861b7",
            name: "CONTRACT SENT",
          },
          {
            id: "a7f2c19e-4ab2-42c6-9318-fd402f2cd920",
            name: "DOWN PAYMENT",
          },
          {
            id: "d75dc5d6-03fa-4c96-a6e6-5cafe8c7e175",
            name: "PROJECT ON PROGRESS",
          },
          {
            id: "9f2301a3-7e87-4df5-a487-fb6fc08c7573",
            name: "PROJECT DONE",
          },
          {
            id: "fded6ea7-25bc-495a-9680-de6ccde5a29b",
            name: "INVOICE SENT",
          },
          {
            id: "91d7f612-55c2-425c-aea9-c935cd399490",
            name: "LAST PAYMENT DONE",
          },
        ]);
      })
      .then(() => {
        Platform.bulkCreate([
          {
            id: "18b25a33-1d0b-42d6-8724-51f88467b5eb",
            name: "WhatsApp",
          },
          {
            id: "3ae67873-005c-4072-a930-18a4222efca6",
            name: "Sribulancer",
          },
          {
            id: "4d0c8bdf-8eab-41bf-95f1-f5f0767caad0",
            name: "Fiverr",
          },
          {
            id: "5bb0e623-6d53-4273-9155-4b22973caa3a",
            name: "Freelancer",
          },
          {
            id: "622d57e4-748e-4317-a128-40c99d0eb080",
            name: "Instagram",
          },
          {
            id: "6eb34325-329e-4fca-9374-bab6f0ebb78a",
            name: "LinkedIn",
          },
          {
            id: "ad050a17-7c15-4004-bdc0-77ed49ecf449",
            name: "UpWork",
          },
          {
            id: "d5290e02-a3f6-4899-97f3-582f75163c96",
            name: "Twitter",
          },
          {
            id: "e31a685e-21d9-4fb5-b8c8-34f78d346bc4",
            name: "Facebook",
          },
          {
            id: "fc595ab3-6f3c-4dd1-9f16-ee92301ed3b3",
            name: "Telegram",
          },
          {
            id: "fd975325-2965-433c-a97f-dfaac8502807",
            name: "Email",
          },
        ]);
      })
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
      .then(() => {
        Status.destroy({
          where: {
            name: {
              [Op.in]: [
                "APPROACHING",
                "MEETING",
                "QUOTATION SENT",
                "CONTRACT SENT",
                "DOWN PAYMENT",
                "PROJECT ON PROGRESS",
                "PROJECT DONE",
                "INVOICE SENT",
                "LAST PAYMENT DONE",
              ],
            },
          },
        });
      })
      .then(() => {
        Platform.destroy({
          where: {
            name: {
              [Op.in]: [
                "WhatsApp",
                "Telegram",
                "Instgram",
                "Facebook",
                "Twitter",
                "LinkedIn",
                "Email",
                "UpWork",
                "Freelancer",
                "Fiverr",
                "Sribulancer",
              ],
            },
          },
        });
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
