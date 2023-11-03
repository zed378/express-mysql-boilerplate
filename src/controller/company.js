const { Clients } = require("../../models");
const { Op } = require("sequelize");

exports.getAllCompany = async (req, res) => {
  try {
    const { p, limit } = req.body;
    const role = req.user.role;
    let skip = p * limit - limit;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      const data = await Clients.findAndCountAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        order: [["createdAt", "ASC"]],
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

exports.getCompanies = async (req, res) => {
  try {
    const role = req.user.role;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      const data = await Clients.findAndCountAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        order: [["createdAt", "ASC"]],
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

exports.getCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user.role;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      const data = await Clients.findOne({
        where: { id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
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

exports.createCompany = async (req, res) => {
  try {
    const role = req.user.role;
    const {
      company_name,
      company_email,
      company_address,
      company_contact,
      company_industry,
      pic_name,
      pic_contact,
      pic_role,
    } = req.body;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      await Clients.findOne({
        where: {
          [Op.or]: [{ company_name }, { company_email }],
        },
      }).then(async (result) => {
        result &&
          res.status(400).send({
            status: "Error",
            message: "Company already exist",
          });

        !result &&
          (await Clients.create({
            company_name,
            company_address,
            company_contact,
            company_email,
            company_industry,
            pic_name,
            pic_contact,
            pic_role,
          }).then((result) => {
            res.status(200).send({
              status: "Success",
              data: result,
            });
          }));
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

exports.editCompany = async (req, res) => {
  try {
    const role = req.user.role;

    const {
      id,
      company_name,
      company_email,
      company_address,
      company_contact,
      company_industry,
      pic_name,
      pic_contact,
      pic_role,
    } = req.body;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      await Clients.update(
        {
          company_name,
          company_email,
          company_address,
          company_contact,
          company_industry,
          pic_name,
          pic_contact,
          pic_role,
        },
        { where: { id } }
      )
        .then(() => {
          res.status(200).send({
            status: "Success",
            message: "Successfully edit company data",
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

exports.deleteCompany = async (req, res) => {
  try {
    const role = req.user.role;
    const { id } = req.params;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      await Clients.destroy({ where: { id } })
        .then(() => {
          res.status(200).send({
            status: "Success",
            message: "Successfully delete company data",
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
