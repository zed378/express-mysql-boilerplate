const { Clients, Invoice } = require("../../models");
const sequelize = require("sequelize");
const dateFormat = require("date-and-time");
const { formatFullDate } = require("node-format-date");
const { delImg } = require("../middleware/deleteImage");
const { invoiceExtractor } = require("../middleware/extractname");

const tradePDF = require("@zed378/invoice-pdfkit");
const romanum = require("romanum");
const fs = require("fs");
const path = require("path");
const __parentDir = path.dirname("../");
const uploadPath = process.env.HOST_URL + "/uploads/invoice/";

const myCompany = {
  company: "Web Compose",
  addr1: "Simomulyo Baru",
  city: "Surabaya",
  zip: "ID 60281",
  state: "East Java",
  country: "Indonesia",
  tel: "+62 83-832-736-223",
  web: "https://webcompose.id",
  email: "contact@webcompose.id",
  account: "BNI 1277722047 / BCA 1030696294",
  //extras: ["More information", "And even more"],
  terms: ["- Only valid if paid on time", "- Pay on time for real please"],
  tagline: "Makes your ideas happen - Thank you for doing business.",
};

exports.getAllInvoices = async (req, res) => {
  try {
    const { p, limit } = req.body;
    const role = req.user.role;
    let skip = p * limit - limit;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      const data = await Invoice.findAndCountAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "companyId"],
        },
        include: [
          {
            model: Clients,
            as: "company",
            attributes: {
              exclude: [
                "updatedAt",
                "createdAt",
                "company_address",
                "company_contact",
                "company_industry",
                "pic_name",
                "pic_contact",
                "pic_role",
              ],
            },
          },
        ],
        order: [["createdAt", "DESC"]],
        offset: skip,
        limit,
      });

      const mappedData = data.rows.map((item) => {
        const newItems = JSON.parse(item.items);
        return {
          id: item.id,
          inv_created: item.inv_created,
          inv_due: item.inv_due,
          inv_num: item.inv_num,
          discount: parseFloat(item.discount),
          stateTax: parseFloat(item.stateTax),
          fedTax: parseFloat(item.fedTax),
          ship: parseFloat(item.ship),
          items: newItems.data,
          filename: uploadPath + item.filename,
          company: item.company,
          total: parseFloat(item.total),
        };
      });

      res.status(200).send({
        status: "Success",
        total: data.count,
        data: mappedData,
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

exports.getInvoices = async (req, res) => {
  try {
    const role = req.user.role;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      const data = await Invoice.findAndCountAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "companyId"],
        },
        include: [
          {
            model: Clients,
            as: "company",
            attributes: {
              exclude: [
                "updatedAt",
                "createdAt",
                "company_address",
                "company_contact",
                "company_industry",
                "pic_name",
                "pic_contact",
                "pic_role",
              ],
            },
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const mappedData = data.rows.map((item) => {
        const newItems = JSON.parse(item.items);
        return {
          id: item.id,
          inv_created: item.inv_created,
          inv_due: item.inv_due,
          inv_num: item.inv_num,
          discount: parseFloat(item.discount),
          stateTax: parseFloat(item.stateTax),
          fedTax: parseFloat(item.fedTax),
          ship: parseFloat(item.ship),
          items: newItems.data,
          filename: uploadPath + item.filename,
          company: item.company,
          total: parseFloat(item.total),
        };
      });

      res.status(200).send({
        status: "Success",
        total: data.count,
        data: mappedData,
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

exports.getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user.role;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      const data = await Invoice.findOne({
        where: { id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "companyId"],
        },
        include: [
          {
            model: Clients,
            as: "company",
            attributes: {
              exclude: [
                "updatedAt",
                "createdAt",
                "company_address",
                "company_contact",
                "company_industry",
                "pic_name",
                "pic_contact",
                "pic_role",
              ],
            },
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const newItems = JSON.parse(data.items);
      const mappedData = {
        id: data.id,
        inv_created: data.inv_created,
        inv_due: data.inv_due,
        inv_num: data.inv_num,
        discount: parseFloat(data.discount),
        stateTax: parseFloat(data.stateTax),
        fedTax: parseFloat(data.fedTax),
        ship: parseFloat(data.ship),
        items: newItems.data,
        filename: uploadPath + data.filename,
        company: data.company,
        total: parseFloat(data.total),
      };

      res.status(200).send({
        status: "Success",
        total: data.count,
        data: mappedData,
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

exports.createInvoice = async (req, res) => {
  try {
    const { language, company, due, items, discount, stateTax, fedTax, ship } =
      req.body;
    const role = req.user.role;

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const monthR = romanum.toNumeral(month + 1);

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      let idx;
      await Invoice.findOne({
        attributes: [[sequelize.fn("max", sequelize.col("inv_id")), "max"]],
      }).then((data) => {
        data ? (idx = data.dataValues.max + 1) : (idx = 1);
      });

      let invoice = idx + "/" + "INV/" + monthR + "/" + year;

      const createdInv =
        language === "id"
          ? formatFullDate(date)
          : dateFormat.format(date, "MMM DD, YYYY");

      let rawDueDate = new Date(due);
      const dueDate =
        language === "id"
          ? formatFullDate(rawDueDate)
          : dateFormat.format(rawDueDate, "MMM DD, YYYY");

      const myOrder = {
        id: invoice,
        date: {
          created: createdInv,
          due: dueDate,
        },
        clientID: company.company_id,
        salesRep: req.user.firstName + " " + req.user.lastName,
        bill: {
          company: company.company_name,
          email: company.company_email,
          addr1: company.company_address,
          city: company.company_city,
        },
        items,
        total: {
          discount,
          stateTax,
          fedTax,
          ship,
        },
      };

      tradePDF.init({
        logo: fs.existsSync(__parentDir + "/src/static/logo.jpg")
          ? fs.readFileSync(__parentDir + "/src/static/logo.jpg")
          : undefined,
        company: myCompany,
        currency: language === "id" ? "IDR" : "USD",
        language,
        locale: language === "id" ? "id" : "en-US",
      });
      const pdfData = tradePDF.invoice(myOrder);
      const invTotal = tradePDF.invoiceTotal(myOrder);
      const filename = `${Date.now()}-${company.company_name.replace(
        /[', ]/g,
        "-"
      )}-invoice.pdf`;
      const path = __parentDir + "/uploads/invoice/";

      fs.writeFile(path + filename, pdfData, "utf-8", async () => {
        await Invoice.create({
          inv_due: rawDueDate,
          inv_num: invoice,
          companyId: company.id,
          discount,
          stateTax,
          fedTax,
          ship,
          filename,
          total: invTotal,
          items: { data: items },
        }).then(() => {
          res.status(200).send({
            status: "Success",
            message: filename + " created successfully",
          });
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

exports.editInvoice = async (req, res) => {
  try {
    const {
      id,
      language,
      inv_num,
      inv_created,
      company,
      due,
      items,
      discount,
      stateTax,
      fedTax,
      filename,
      ship,
    } = req.body;
    const role = req.user.role;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      const myOrder = {
        id: inv_num,
        date: {
          created: inv_created,
          due: due,
        },
        bill: {
          company: company.company_name,
          email: company.company_email,
        },
        items,
        total: {
          discount,
          stateTax,
          fedTax,
          ship,
        },
      };

      delImg(invoiceExtractor(filename));

      tradePDF.init({
        logo: fs.existsSync(__parentDir + "/src/static/logo.jpg")
          ? fs.readFileSync(__parentDir + "/src/static/logo.jpg")
          : undefined,
        company: myCompany,
        currency: language === "id" ? "IDR" : "USD",
        language,
        locale: language === "id" ? "id" : "en-US",
      });
      const pdfData = tradePDF.invoice(myOrder);
      const invTotal = tradePDF.invoiceTotal(myOrder);
      const newFilename = `${Date.now()}-${company.company_name.replace(
        /[', ]/g,
        "-"
      )}-invoice.pdf`;
      const path = __parentDir + "/uploads/invoice/";

      fs.writeFile(path + newFilename, pdfData, "utf-8", async () => {
        await Invoice.update(
          {
            inv_due: due,
            inv_num,
            companyId: company.id,
            discount,
            stateTax,
            fedTax,
            ship,
            filename: newFilename,
            total: invTotal,
            items: { data: items },
          },
          {
            where: { id },
          }
        ).then(() => {
          res.status(200).send({
            status: "Success",
            message: inv_num + " updated successfully",
          });
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

exports.deleteInvoice = async (req, res) => {
  try {
    const { id, filename } = req.body;
    const role = req.user.role;

    if (role === "SYS" || role === "ADMIN" || role === "MARKETING") {
      delImg(invoiceExtractor(filename));

      await Invoice.destroy({ where: { id } })
        .then(() => {
          res.status(200).send({
            status: "Success",
            message: "Success delete invoice data",
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
