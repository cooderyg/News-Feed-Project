const express = require("express");
const router = express.Router();
const { Places } = require("../models");
const { Menus } = require("../models");

// 맛집 등록
router.post("/:placeCategoryId", async (req, res) => {
  const { placeCategoryId } = req.params;
  const {
    name,
    address,
    phoneNumber,
    foodType,
    priceRange,
    openingHours,
    star,
    imageUrl,
    menu,
  } = req.body;
  try {
    const place = await Places.create({
      PlaceCategoryId: Number(placeCategoryId),
      name,
      address,
      phoneNumber,
      foodType,
      priceRange,
      openingHours,
      star,
      imageUrl,
    });
    await menu.forEach((menu) => {
      Menus.create({
        PlaceId: place.placeId,
        name: menu.name,
        price: menu.price,
      });
    });
    res.status(200).json({ message: "Ok" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
