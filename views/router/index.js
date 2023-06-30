const express = require('express');
const app = express();
const router = express.Router();
const { PlaceCategories, Places } = require('../../models');
const { Op } = require('sequelize');

router.get('/', (req, res) => {
  if (req.session.user) return res.render('index', { ...req.session.user, login: 1 });
  return res.render('index', { login: 0 });
});
router.get('/category', (req, res) => {
  res.render('category');
});
router.get('/detail/:placeId', (req, res) => {
  if (req.session.user) return res.render('detail', { ...req.session.user, login: 1 });
  return res.render('detail', { login: 0, placeId: req.params.placeId });
});
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  return res.render('login', { login: 0 });
});
router.get('/sign-up', (req, res) => {
  if (req.session.user) return res.redirect('/');
  return res.render('sign-up', { login: 0 });
});
router.get('/mypage', (req, res) => {
  if (req.session.user) return res.render('mypage', { ...req.session.user, login: 1 });
  return res.redirect('/');
});
router.get('/editpassword', (req, res) => {
  if (req.session.user) return res.render('editpassword', { ...req.session.user, login: 1 });
  return res.redirect('/');
});
router.get('/categories/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    const places = await Places.findAll({
      where: { PlaceCategoryId: categoryId },
      limit: 20,
      order: [['star', 'DESC']],
    });

    const { name } = await PlaceCategories.findOne({ where: { PlaceCategoryId: categoryId }, attributes: ['name'] });

    if (req.session.user) return res.render('category', { ...req.session.user, login: 1, data: places, name });
    return res.render('category', { login: 0, data: places, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});
router.get('/search', async (req, res) => {
  try {
    let offset = 0;

    const { data, page } = req.query;

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

// 메인페이지
// 카테고리페이지
// 상세페이지
// 로그인페이지

module.exports = router;
