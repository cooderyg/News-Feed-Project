const express = require('express');
const app = express();
const router = express.Router();

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
router.get('/categories/:categoryId', (req, res) => {
  if (req.session.user) return res.render('index', { ...req.session.user, login: 1 });
  return res.render('category', { login: 0, categoryName: '부산' });
});

// search 페이지의 경우 places.route.js 참고

// 메인페이지
// 카테고리페이지
// 상세페이지
// 로그인페이지

module.exports = router;
