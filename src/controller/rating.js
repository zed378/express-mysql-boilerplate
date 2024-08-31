const { Products, Users, Ratings } = require("../../models");
const { Op } = require("sequelize");

// Get all ratings
const getAllRatings = async (req, res) => {
  try {
    const ratings = await Ratings.findAll({
      include: [{ model: Users }, { model: Products }],
    });
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a rating by ID
const getRatingById = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Ratings.findOne({
      where: { id },
      include: [{ model: Users }, { model: Products }],
    });
    if (rating) {
      res.status(200).json(rating);
    } else {
      res.status(404).json({ error: "Rating not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new rating
const createRating = async (req, res) => {
  try {
    const { userId, productId, rate, comment } = req.body;
    const newRating = await Ratings.create({
      userId,
      productId,
      rate,
      comment,
    });
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a rating by ID
const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rate, comment } = req.body;
    const rating = await Ratings.findByPk(id);
    if (rating) {
      rating.rate = rate;
      rating.comment = comment;
      await rating.save();
      res.status(200).json(rating);
    } else {
      res.status(404).json({ error: "Rating not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a rating by ID
const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Ratings.findByPk(id);
    if (rating) {
      await rating.destroy();
      res.status(200).json({ message: "Rating deleted successfully" });
    } else {
      res.status(404).json({ error: "Rating not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
