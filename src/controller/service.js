const { Service } = require("../../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

exports.getAllService = async (req, res) => {
  try {
    const data = await Service.findAndCountAll({
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

exports.getService = async (req, res) => {
  try {
    const { id } = req.params;

    await Service.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    }).then((data) => {
      res.status(200).send({
        status: "Success",
        data,
      });
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.getServiceCategory = async (req, res) => {
  try {
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.getServicesByCategory = async (req, res) => {
  try {
    const { svcId } = req.body;

    await Service.findAndCountAll({
      where: { svcId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["svc_num", "ASC"]],
    }).then((data) => {
      res.status(200).send({
        status: "Success",
        total: data.count,
        data: data.rows,
      });
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.createService = async (req, res) => {
  try {
    const { svcId, name } = req.body;

    const getLastNum = await Service.findOne({
      attributes: [[sequelize.fn("max", sequelize.col("svc_num")), "max"]],
      where: {
        svcId: {
          [Op.like]: `%${svcId}%`,
        },
      },
    });

    await Service.create({
      svcId,
      name,
      svc_num: getLastNum.dataValues.max + 1,
    }).then(() => {
      res.status(200).send({
        status: "Success",
        message: "Successfully created service",
      });
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.editService = async (req, res) => {
  try {
    const { svcId, name, id } = req.body;

    await Service.update({ svcId, name }, { where: { id } }).then(() => {
      res.status(200).send({
        status: "Success",
        message: "Successfully update service",
      });
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.destroy({ where: { id } }).then(() => {
      res.status(200).send({
        status: "Success",
        message: "Successfully delete service",
      });
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};
