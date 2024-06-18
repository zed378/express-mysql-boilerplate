const { Products, Categories } = require("../../models");
const { Op } = require("sequelize");

exports.getAllProducts = async (req, res) => {
  try {
    const { p, limit } = req.body;
    const { cat } = req.query;
    let skip = p * limit - limit;

    const data = await Products.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["createdAt", "DESC"]],
      offset: skip,
      limit,
    });

    res.status(200).send({
      status: "Success",
      total: data.count,
      data: data.rows,
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};
