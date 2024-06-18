const { Platform } = require("../../models");

exports.getAllPlatform = async (req, res) => {
  try {
    const { p, limit } = req.body;
    const role = req.user.role;
    let skip = p * limit - limit;

    role === "SYS" || role === "ADMIN" || role === "MARKETING"
      ? await Platform.findAndCountAll({
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          order: [["createdAt", "DESC"]],
          offset: skip,
          limit,
        }).then((result) => {
          res.status(200).send({
            status: "Success",
            total: result.count,
            data: result.rows,
          });
        })
      : res.status(400).send({
          status: "Error",
          message: "You have no rights to access the data",
        });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.getPlatforms = async (req, res) => {
  try {
    const role = req.user.role;

    role === "SYS" || role === "ADMIN" || role === "MARKETING"
      ? await Platform.findAndCountAll({
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          order: [["createdAt", "DESC"]],
        }).then((result) => {
          res.status(200).send({
            status: "Success",
            total: result.count,
            data: result.rows,
          });
        })
      : res.status(400).send({
          status: "Error",
          message: "You have no rights to access the data",
        });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.getPlatform = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user.role;

    role === "SYS" || role === "ADMIN" || role === "MARKETING"
      ? await Platform.findOne({
          where: { id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        }).then((result) => {
          res.status(200).send({
            status: "Success",
            data: result,
          });
        })
      : res.status(400).send({
          status: "Error",
          message: "You have no rights to access the data",
        });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.createPlatform = async (req, res) => {
  try {
    const role = req.user.role;
    const { name } = req.body;

    role === "SYS" || role === "ADMIN" || role === "MARKETING"
      ? await Platform.findOne({
          where: {
            name,
          },
        }).then(async (result) => {
          result &&
            res.status(400).send({
              status: "Error",
              message: "Platform already exist",
            });

          !result &&
            (await Platform.create({
              name,
            }).then((result) => {
              res.status(200).send({
                status: "Success",
                data: result,
              });
            }));
        })
      : res.status(400).send({
          status: "Error",
          message: "You have no rights to access the data",
        });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.editPlatform = async (req, res) => {
  try {
    const role = req.user.role;

    const { id, name } = req.body;

    role === "SYS" || role === "ADMIN" || role === "MARKETING"
      ? await Platform.update(
          {
            name,
          },
          { where: { id } }
        )
          .then(() => {
            res.status(200).send({
              status: "Success",
              message: "Successfully edit platform data",
            });
          })
          .catch((error) => {
            res.status(400).send({
              status: "Error",
              message: error,
            });
          })
      : res.status(400).send({
          status: "Error",
          message: "You have no rights to access the data",
        });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.deletePlatform = async (req, res) => {
  try {
    const role = req.user.role;
    const { id } = req.params;

    role === "SYS" || role === "ADMIN" || role === "MARKETING"
      ? await Platform.destroy({ where: { id } }).then(() => {
          res.status(200).send({
            status: "Success",
            message: "Successfully delete platform data",
          });
        })
      : res.status(400).send({
          status: "Error",
          message: "You have no rights to access the data",
        });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};
