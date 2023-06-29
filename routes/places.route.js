const express = require('express');
const router = express.Router();
const { Places, Reviews, ReviewImages, Menus, Users } = require('../models');
const { Op } = require('sequelize');

// 맛집 등록 ok
router.post('/:placeCategoryId', async (req, res) => {
  const { placeCategoryId } = req.params;
  const { name, address, phoneNumber, foodType, priceRange, openingHours, star, imageUrl, menu } = req.body;

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
    res.status(200).json({ message: 'Ok' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

const placePerPage = 20; // 페이지 당 항목 수
// 맛집 전체 조회
router.get('/', async (req, res) => {
  const { page } = req.query;
  const pageNum = parseInt(page) || 1;
  const offset = (pageNum - 1) * placePerPage;
  const limit = placePerPage;

  try {
    const places = await Places.findAll({
      limit,
      offset,
      include: [
        {
          model: Menus,
          as: 'Menus',
        },
      ],
    });
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
// categoryId로만 특정 검색
router.get('/category/:placeCategoryId', async (req, res) => {
  const { placeCategoryId } = req.params;
  const { page } = req.query;
  const pageNum = parseInt(page) || 1;
  const offset = (pageNum - 1) * itemsPerPage;
  const limit = itemsPerPage;

  try {
    const places = await Places.findAll({
      where: { PlaceCategoryId: placeCategoryId },
      limit,
      offset,
      include: [
        {
          model: Menus,
          as: 'Menus',
        },
      ],
    });
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//  plcae_ID만 상세 조회

router.get('/:placeId', async (req, res) => {
  const { placeId } = req.params;
  try {
    const place = await Places.findOne({
      where: { placeId: +placeId },
      include: [
        {
          model: Menus,
        },
        {
          model: Reviews,
          include: [
            {
              model: Users,
              attributes: ['name'],
            },
            {
              model: ReviewImages,
              attributes: ['imageUrl'],
            },
          ],
        },
      ],
    });
    res.status(200).json(place);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

// 수정 API
router.put('/:placeId', async (req, res) => {
  const { placeId } = req.params;
  const { name, address, phoneNumber, foodType, priceRange, openingHours, star, imageUrl, menu } = req.body;

  try {
    const place = await Places.update(
      {
        name,
        address,
        phoneNumber,
        foodType,
        priceRange,
        openingHours,
        star,
        imageUrl,
      },
      {
        where: { placeId: placeId },
      }
    );

    // 기존에 있는 메뉴들을 삭제??
    await Menus.destroy({
      where: { PlaceId: placeId },
    });

    await menu.forEach((menu) => {
      Menus.create({
        PlaceId: placeId,
        name: menu.name,
        price: menu.price,
      });
    });

    res.status(200).json({ message: '수정이 완료 되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
// 삭제 API
router.delete('/:placeId', async (req, res) => {
  const { placeId } = req.params;

  try {
    // 1:N 관계라 하나의 맛집이 삭제되면 관련된 메뉴도 삭제해야 함
    await Menus.destroy({
      where: { PlaceId: placeId },
    });

    // 1:N 관계라 하나의 맛집이 삭제되면 관련된 메뉴도 삭제해야 함
    await Places.destroy({
      where: { placeId: placeId },
    });

    res.status(200).json({ message: '맛집이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get('/main/best12', async (req, res) => {
  try {
    res.status(201).json(await Places.findAll({ order: [['star', 'DESC']], limit: 12 }));
  } catch (err) {
    console.error(err);
    res.status(412).json({ message: '오류가 발생하였습니다.' });
  }
});

router.get('/search/:data', async (req, res) => {
  try {
    let offset = 0;

    const { data } = req.params;
    const { page } = req.query;

    if (!data) return res.status(412).json({ message: '검색어를 입력해 주세요.' });

    const presentMaxPageCount = Math.ceil(page / 10) * 10;
    const presentminPageCount = Math.ceil(page / 10) * 10 - 9;
    const maxPageCount = Math.ceil((await Places.count({ where: { [Op.or]: { name: { [Op.like]: `%${data}%` }, foodType: { [Op.like]: `%${data}%` }, address: { [Op.like]: `%${data}%` } } } })) / 20);

    if (page > 1) {
      offset = 20 * (page - 1);
    }
    const result = await Places.findAll({ where: { [Op.or]: { name: { [Op.like]: `%${data}%` }, foodType: { [Op.like]: `%${data}%` }, address: { [Op.like]: `%${data}%` } } }, limit: 20, offset: offset, order: [['star', 'DESC']] });

    if (req.session.user) return res.render('search', { ...req.session.user, login: 1, data, page, result, presentMaxPageCount, presentminPageCount, maxPageCount });
    return res.render('search', { login: 0, data, page, result, presentMaxPageCount, presentminPageCount, maxPageCount });
  } catch (err) {
    console.error(err);
    res.status(412).json({ message: '오류가 발생하였습니다.' });
  }
});

module.exports = router;
