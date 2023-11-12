const { Users } = require("../../models");
const { delImg } = require("../middleware/deleteImage");
const Joi = require("joi");
const inputValidation = Joi.object({
  id: Joi.string().min(3),
  username: Joi.string().min(3),
  picture: Joi.string().min(3),
});

exports.getAllUser = async (req, res) => {
  try {
    const role = req.user.role;

    if (role === "SYS" || role === "ADMIN") {
      const data = await Users.findAndCountAll({
        attributes: {
          exclude: [
            "password",
            "updatedAt",
            "createdAt",
            "otp",
            "otpToken",
            "token",
          ],
        },
      });

      res.status(200).send({
        status: "Success",
        total: data.count,
        data: data.rows,
      });
    } else {
      res.status(400).send({
        status: "Error",
        message: "You have no rights to access the data",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.filterdUserByRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userRole = req.user.role;

    if (userRole === "SYS" || userRole === "ADMIN") {
      const data = await Users.findAndCountAll({
        where: { role },
        attributes: {
          exclude: ["password", "updatedAt", "otp", "otpToken", "token"],
        },
        order: [["createdAt", "DESC"]],
      });

      const newData = data.rows.map((item) => {
        const name = item.firstName + " " + item.lastName;
        return {
          id: item.id,
          name,
          username: item.username,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          picture: item.picture,
          role: item.role,
          isActive: item.isActive,
          join: item.createdAt,
        };
      });

      res.status(200).send({
        status: "Success",
        total: data.count,
        data: newData,
      });
    } else {
      res.status(400).send({
        status: "Error",
        message: "You have no rights to access the data",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user.role;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      const data = await Users.findOne({
        where: { id },
        attributes: {
          exclude: [
            "password",
            "updatedAt",
            "createdAt",
            "otp",
            "otpToken",
            "token",
          ],
        },
      });

      res.status(200).send({
        status: "Success",
        data,
      });
    } else {
      res.status(400).send({
        status: "Error",
        message: "You have no rights to access the data",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.updateUserName = async (req, res) => {
  try {
    const { id, username } = req.body;

    const { error } = inputValidation.validate({
      id,
      username,
    });

    if (error) {
      return res.send({
        status: "Error",
        message: error.details[0].message,
      });
    }
    const isUsernameExist = await Users.findOne({ where: { username } });

    isUsernameExist &&
      res.status(400).send({
        status: "Error",
        message: "Username already taken. Choose another username.",
      });

    !isUsernameExist &&
      (await Users.update(
        { username },
        {
          where: { id },
        }
      ).then(() => {
        res.status(200).send({
          status: "Success",
          data: "Success update username",
        });
      }));
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.updatePict = async (req, res) => {
  try {
    const { id } = req.body;
    const picture = req.file.filename;

    const { error } = inputValidation.validate({
      id,
      picture,
    });

    if (error) {
      return res.send({
        status: "Error",
        message: error.details[0].message,
      });
    }

    const isUserExist = await Users.findOne({ where: { id } });

    if (isUserExist) {
      delImg(isUserExist.picture);
      await Users.update(
        { picture },
        {
          where: { id },
        }
      ).then(() => {
        res.status(200).send({
          status: "Success",
          message: "Success update profile picture",
        });
      });
    }
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.setIsActive = async (req, res) => {
  try {
    const { id, isActive } = req.body;

    req.user.role === ("SYS" || "ADMIN")
      ? await Users.update({ isActive }, { where: { id } }).then(() => {
          res.status(200).send({
            status: "Success",
            message: "Success update user status",
          });
        })
      : res.status(400).send({
          status: "Error",
          message: "Access Denied",
        });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.updateUserFullName = async (req, res) => {
  try {
    const role = req.user.role;
    const { id, firstName, lastName, username } = req.body;

    if (role === "SYS" || role === "ADMIN" || id === req.user.id) {
      await Users.update(
        {
          firstName,
          lastName,
          username,
        },
        { where: { id } }
      ).then(() => {
        res.status(200).send({
          status: "Success",
          message: "User successfully updated",
        });
      });
    } else {
      res.status(400).send({
        status: "Error",
        message: "You have no rights to access the data",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user.role;
    if (role === "SYS" || role === "ADMIN") {
      await Users.destroy({ where: { id } }).then(() => {
        res.status(200).send({
          status: "Success",
          message: "User successfully deleted",
        });
      });
    } else {
      res.status(400).send({
        status: "Error",
        message: "You have no rights to access the data",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};
