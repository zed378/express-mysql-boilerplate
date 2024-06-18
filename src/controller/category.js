const { Categories } = require("../../models");
const { Op } = require("sequelize");

exports.getAllCategories = async (req, res) => {
  try {
    const { p, limit } = req.body;
    let skip = p * limit - limit;

    await Categories.findAndCountAll({
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
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    await Categories.findAndCountAll({
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
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Categories.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.status(200).send({
      status: "Success",
      data,
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const role = req.user.role;
    const { name, description } = req.body;

    role === "SYS" || role === "ADMIN"
      ? await Categories.findOne({ where: { name } }).then((result) => {
          result &&
            res.status(400).send({
              status: "Error",
              message: "Category already exist",
            });

          !result &&
            Categories.create({ name, description }).then((response) => {
              res.status(200).send({
                status: "Success",
                data: response,
              });
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

exports.updateCategory = async (req, res) => {
  try {
    const role = req.user.role;
    const { id, name, description } = req.body;

    role === "SYS" || role === "ADMIN"
      ? await Categories.update({ name, description }, { where: { id } }).then(
          (response) => {
            res.status(200).send({
              status: "Success",
              message: "Successfully update category.",
            });
          }
        )
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

exports.deleteCategory = async (req, res) => {
  try {
    const role = req.user.role;
    const { id } = req.params;

    role === "SYS" || role === "ADMIN"
      ? await Categories.destroy({ where: { id } }).then(() => {
          res.status(200).send({
            status: "Success",
            message: "Successfully delete category.",
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
