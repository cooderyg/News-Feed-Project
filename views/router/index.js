const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.user) return res.render('index', { ...req.session.user, login: 1 });
  return res.render('index', { login: 0 });
});
router.get('/category', (req, res) => {
  res.render('category');
});
router.get('/detail', (req, res) => {
  if (req.session.user) return res.render('detail', { ...req.session.user, login: 1 });
  return res.render('detail', { login: 0 });
});
router.get('/login', (req, res) => {
  res.render('login');
});
router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});
// 메인페이지
// 카테고리페이지
// 상세페이지
// 로그인페이지

module.exports = router;
