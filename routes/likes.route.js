const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { Likes } = require('../models');

// 좋아요 수 확인하기
router.get('/:placeId', async (req, res) => {
  const likes = await Likes.count({
    where: { PlaceId: placeId },
  });

  return res.status(200).json({ data: likes });
});

//좋아요 만들기
router.post('/:placeId', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
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
