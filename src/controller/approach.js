const { Approach, Status, Platform, Users, Clients } = require("../../models");

exports.getAllApproach = async (req, res) => {
  try {
    const { p, limit } = req.body;
    const role = req.user.role;
    let skip = p * limit - limit;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      const data = await Approach.findAndCountAll({
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "statusId",
            "userId",
            "companyId",
            "platformId",
          ],
        },
        include: [
          {
            model: Users,
            as: "user",
            attributes: {
              exclude: [
                "updatedAt",
                "createdAt",
                "password",
                "otp",
                "otpToken",
                "token",
                "email",
                "picture",
                "role",
                "isActive",
              ],
            },
          },
          {
            model: Clients,
            as: "company",
            attributes: {
              exclude: [
                "updatedAt",
                "createdAt",
                "company_email",
                "company_address",
                "company_contact",
                "company_industry",
                "pic_name",
                "pic_contact",
                "pic_role",
              ],
            },
          },
          {
            model: Platform,
            as: "platform",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
          {
            model: Status,
            as: "status",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
        ],
        order: [["createdAt", "DESC"]],
        offset: skip,
        limit,
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

exports.getAllUserApproach = async (req, res) => {
  try {
    const { p, limit } = req.body;
    const role = req.user.role;
    const userId = req.user.id;
    let skip = p * limit - limit;

    if (role === "ADMIN" || role === "MARKETING") {
      const data = await Approach.findAndCountAll({
        where: { userId },
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "statusId",
            "userId",
            "companyId",
            "platformId",
          ],
        },
        include: [
          {
            model: Users,
            as: "user",
            attributes: {
              exclude: [
                "updatedAt",
                "createdAt",
                "password",
                "otp",
                "otpToken",
                "token",
                "email",
                "picture",
                "role",
                "isActive",
              ],
            },
          },
          {
            model: Clients,
            as: "company",
            attributes: {
              exclude: [
                "updatedAt",
                "createdAt",
                "company_email",
                "company_address",
                "company_contact",
                "company_industry",
                "pic_name",
                "pic_contact",
                "pic_role",
              ],
            },
          },
          {
            model: Platform,
            as: "platform",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
          {
            model: Status,
            as: "status",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
        ],
        order: [["createdAt", "DESC"]],
        offset: skip,
        limit,
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

exports.filteredApproach = async (req, res) => {
  try {
    const { statusId } = req.query;
    const role = req.user.role;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      const data = await Approach.findAndCountAll({
        where: { statusId },
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "statusId",
            "userId",
            "companyId",
            "platformId",
          ],
        },
        include: [
          {
            model: Users,
            as: "user",
            attributes: {
              exclude: [
                "updatedAt",
                "createdAt",
                "password",
                "otp",
                "otpToken",
                "token",
                "email",
                "picture",
                "role",
                "isActive",
              ],
            },
          },
          {
            model: Clients,
            as: "company",
            attributes: {
              exclude: [
                "updatedAt",
                "createdAt",
                "company_email",
                "company_address",
                "company_contact",
                "company_industry",
                "pic_name",
                "pic_contact",
                "pic_role",
              ],
            },
          },
          {
            model: Platform,
            as: "platform",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
          {
            model: Status,
            as: "status",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
        ],
        order: [["createdAt", "DESC"]],
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

exports.getApproach = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user.role;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      const data = await Approach.findOne({
        where: { id },
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "statusId",
            "userId",
            "companyId",
            "platformId",
          ],
        },
        include: [
          {
            model: Users,
            as: "user",
            attributes: {
              exclude: [
                "updatedAt",
                "createdAt",
                "password",
                "otp",
                "otpToken",
                "token",
                "email",
                "picture",
                "role",
                "isActive",
              ],
            },
          },
          {
            model: Clients,
            as: "company",
            attributes: {
              exclude: [
                "updatedAt",
                "createdAt",
                "company_email",
                "company_address",
                "company_contact",
                "company_industry",
                "pic_name",
                "pic_contact",
                "pic_role",
              ],
            },
          },
          {
            model: Platform,
            as: "platform",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
          {
            model: Status,
            as: "status",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
        ],
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

exports.createApproach = async (req, res) => {
  try {
    const role = req.user.role;
    const {
      date,
      companyId,
      platformId,
      approachingBy,
      notes,
      statusId,
      userId,
    } = req.body;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      await Approach.create({
        date,
        companyId,
        platformId,
        approachingBy,
        notes,
        statusId,
        userId,
      }).then((result) => {
        res.status(200).send({
          status: "Success",
          data: result,
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

exports.editApproach = async (req, res) => {
  try {
    const role = req.user.role;

    const {
      id,
      date,
      companyId,
      platformId,
      approachingBy,
      notes,
      statusId,
      userId,
    } = req.body;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      await Approach.update(
        {
          date,
          companyId,
          platformId,
          approachingBy,
          notes,
          statusId,
          userId,
        },
        { where: { id } }
      )
        .then(() => {
          res.status(200).send({
            status: "Success",
            message: "Successfully edit approach data",
          });
        })
        .catch((error) => {
          res.status(400).send({
            status: "Error",
            message: error,
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

exports.deleteApproach = async (req, res) => {
  try {
    const role = req.user.role;
    const { id } = req.params;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      await Approach.destroy({ where: { id } })
        .then(() => {
          res.status(200).send({
            status: "Success",
            message: "Successfully delete approach data",
          });
        })
        .catch((error) => {
          res.status(400).send({
            status: "Error",
            message: error,
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

exports.changeStatus = async (req, res) => {
  try {
    const { id, statusId } = req.body;
    const role = req.user.role;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      await Approach.update(
        {
          statusId,
        },
        { where: { id } }
      )
        .then(() => {
          res.status(200).send({
            status: "Success",
            message: "Successfully update approach status data",
          });
        })
        .catch((error) => {
          res.status(400).send({
            status: "Error",
            message: error,
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
