const { Products, Categories } = require("../../models");
const { Op } = require("sequelize");

exports.getProducts = async (req, res) => {
  try {
    const { p, limit } = req.body;
    const { cat } = req.query;
    let skip = p * limit - limit;

    let where = {};
    if (cat) {
      const category = await Categories.findOne({
        where: { name: cat },
        include: [
          {
            model: Products,
            as: "products",
            attributes: ["id"],
            through: { attributes: [] },
          },
        ],
      });

      if (category) {
        const productIds = category.products.map((product) => product.id);
        where.id = { [Op.in]: productIds };
      } else {
        where.id = { [Op.in]: [] };
      }
    }

    // Query products with the specified criteria
    const data = await Products.findAndCountAll({
      include: [
        {
          model: Categories,
          as: "categories",
          through: { attributes: [] },
          attributes: { exclude: ["description", "createdAt", "updatedAt"] },
        },
      ],
      distinct: true,
      where,
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
      status: "Failed",
      message: error.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.body;

    const product = await Products.findOne({
      where: { id },
      include: [
        {
          model: Categories,
          as: "categories",
          through: { attributes: [] },
          attributes: { exclude: ["description", "createdAt", "updatedAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    res.status(200).send({
      status: "Success",
      data: product,
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, categoryIds } = req.body;
  try {
    const product = await Products.create({ name, description, price });

    if (categoryIds && categoryIds.length > 0) {
      const categories = await Categories.findAll({
        where: {
          id: categoryIds,
        },
      });
      await product.addCategories(categories);
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id, name, description, price, categoryIds } = req.body;

    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).send({
        status: "Error",
        message: "Product not found",
      });
    }

    await product.update({
      name,
      description,
      price,
    });

    if (categoryIds && Array.isArray(categoryIds)) {
      const categories = await Categories.findAll({
        where: { id: categoryIds },
      });
      await product.setCategories(categories);
    }

    const data = await Products.findOne({
      where: { id },
      include: [
        {
          model: Categories,
          as: "categories",
          through: { attributes: [] },
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    res.status(200).send({
      status: "Success",
      message: "Succesfully update",
      data: data,
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).send({
        status: "Error",
        message: "Product not found",
      });
    }

    await product.destroy();

    res.status(200).send({
      status: "Success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};
