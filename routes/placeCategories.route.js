const express = require('express');
const router = express.Router();
const { PlaceCategories, Places } = require('../models');

router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    const result = await PlaceCategories.create({ name });
    res.status(201).json({ data: result });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get('/', async (req, res) => {
  try {
    const placeCategories = await PlaceCategories.findAll({
      include: [
        {
          model: Places,
          as: 'Places',
          limit: 1,
          order: [['star', 'DESC']],
          attributes: ['imageUrl'],
        },
      ],
    });
    res.status(200).json({ data: placeCategories });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
