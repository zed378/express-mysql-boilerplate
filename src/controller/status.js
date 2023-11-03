const { Status } = require("../../models");

exports.getAllStatus = async (req, res) => {
  try {
    const data = await Status.findAndCountAll({
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
