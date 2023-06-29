const express = require('express');
const router = express.Router();
const { PlaceCategories } = require('../models');

// 카테고리 등록
router.post('/', async (req, res) => {
  const { categoryName } = req.body;

  try {
    await PlaceCategories.create({
      categoryName,
    });
    res.status(200).json({ message: '카테고리가 등록되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 카테고리 전체 조회
router.get('/', async (req, res) => {
  try {
    const categories = await PlaceCategories.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 특정 카테고리 조회
router.get('/:categoryId', async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await PlaceCategories.findOne({
      where: { categoryId },
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 카테고리 수정
router.put('/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  const { categoryName } = req.body;

  try {
    await PlaceCategories.update(
      {
        categoryName,
      },
      {
        where: { categoryId },
      }
    );
    res.status(200).json({ message: '카테고리가 수정되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// 카테고리 삭제
router.delete('/:categoryId', async (req, res) => {
  const { categoryId } = req.params;

  try {
    await PlaceCategories.destroy({
      where: { categoryId },
    });
    res.status(200).json({ message: '카테고리가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;

router.get('/main/best12', async (req, res) => {
  try {
    res.status(201).json(await Places.findAll({ order: [['star', 'DESC']], limit: 12 }));
  } catch (err) {
    console.error(err);
    res.status(412).json({ message: '오류가 발생하였습니다.' });
  }
});

// router.get('/search/:data', async (req, res) => {
//   try {
//     let offset = 0;

//     const { data } = req.params;
//     const { page } = req.query;

//     if (!data) return res.status(412).json({ message: '검색어를 입력해 주세요.' });

//     const presentMaxPageCount = Math.ceil(page / 10) * 10;
//     const presentminPageCount = Math.ceil(page / 10) * 10 - 9;
//     const maxPageCount = Math.ceil((await Places.count({ where: { [Op.or]: { name: { [Op.like]: `%${data}%` }, foodType: { [Op.like]: `%${data}%` }, address: { [Op.like]: `%${data}%` } } } })) / 20);

//     if (page > 1) {
//       offset = 20 * (page - 1);
//     }
//     const result = await Places.findAll({ where: { [Op.or]: { name: { [Op.like]: `%${data}%` }, foodType: { [Op.like]: `%${data}%` }, address: { [Op.like]: `%${data}%` } } }, limit: 20, offset: offset, order: [['star', 'DESC']] });

//     if (req.session.user) return res.render('search', { ...req.session.user, login: 1, data, page, result, presentMaxPageCount, presentminPageCount, maxPageCount });
//     return res.render('search', { login: 0, data, page, result, presentMaxPageCount, presentminPageCount, maxPageCount });
//   } catch (err) {
//     console.error(err);
//     res.status(412).json({ message: '오류가 발생하였습니다.' });
//   }
// });

module.exports = router;
