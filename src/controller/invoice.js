const { Clients, Invoice } = require("../../models");
const dateFormat = require("date-and-time");
const { formatFullDate } = require("node-format-date");

const tradePDF = require("@zed378/invoice-pdfkit");
const romanum = require("romanum");
const fs = require("fs");
const path = require("path");
const __parentDir = path.dirname("../");
const uploadPath = process.env.HOST_URL + "/uploads/invoice/";

const myCompany = {
  company: "Web Compose",
  email: "contact@webcompose.id",
  web: "https://webcompose.id",
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
        order: [["createdAt", "ASC"]],
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
        order: [["createdAt", "ASC"]],
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
        order: [["createdAt", "ASC"]],
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

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const yearR = romanum.toNumeral(year);
    const monthR = romanum.toNumeral(month + 1);
    const dayR = romanum.toNumeral(day);

    let idx = 0;
    await Invoice.findAndCountAll().then((data) => {
      idx = data.count + 1;
    });
    let invoice = "INV/" + year + "/" + monthR + "/" + dayR + "/" + idx;

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
    const filename = `${Date.now()}-${company.company_name.replaceAll(
      " ",
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
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};
