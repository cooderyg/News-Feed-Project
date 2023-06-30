const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { Likes, Places } = require('../models');

// 나의 좋아요 수, 좋아요 업체 확인하기
router.get('/user/mylike', authMiddleware, async (req, res) => {
  let offset = 0;

  const { userId } = req.session.user;
  const page = req.query.page ?? 1;

  const myLikescount = await Likes.count({ where: { UserId: userId } });

  if (page > 1) {
    offset = 20 * (page - 1);
  }

  console.log(offset);

  const result = {
    page: {
      present: page,
      max: Math.ceil(page / 10) * 10,
      min: Math.ceil(page / 10) * 10 - 9,
      maxPageCount: Math.ceil(myLikescount / 20),
    },
    data: {
      list: await Places.findAll({ include: [{ model: Likes, as: 'Likes', where: { UserId: userId } }], limit: 20, offset: offset }),
      count: myLikescount,
    },
  };

  res.status(201).json(result);
});

router.get('/detail/:placeId', authMiddleware, async (req, res) => {
  try {
    const { placeId } = req.params;
    const { userId } = req.session.user;
    const like = await Likes.findOne({
      where: { UserId: userId, PlaceId: +placeId },
    });
    console.log(like);
    res.status(200).json(like);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '조회에 실패했습니다.' });
  }
});

// 좋아요 수 확인하기
router.get('/:placeId', async (req, res) => {
  const likes = await Likes.count({
    where: { PlaceId: placeId },
  });

  return res.status(200).json({ data: likes });
});

//좋아요 만들기
router.post('/:placeId', authMiddleware, async (req, res) => {
  const { userId } = req.session.user;
  const { placeId } = req.params;

  try {
    const existingLike = await Likes.findOne({
      where: { UserId: userId, PlaceId: +placeId },
    });

    if (existingLike) {
      await Likes.destroy({
        where: {
          UserId: userId,
          PlaceId: +placeId,
        },
      });
      res.status(200).json({
        liked: false,
      });
    } else {
      await Likes.create({
        UserId: userId,
        PlaceId: +placeId,
      });
      res.status(200).json({
        liked: true,
      });
    }
  } catch (error) {
    console.error('오류가 발생했습니다.', error);
    res.status(500).json({ message: '오류가 발생했습니다.' });
  }
});

module.exports = router;
