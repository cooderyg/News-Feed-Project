const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { Likes } = require('../models');
const { Users } = require('../models');
const { Places } = require('../models');

// 개념 맛집플레이스에 해당 사용자가 좋아요를 했는지

// 좋아요 확인하기
router.get('/', async (req, res) => {
  const likes = await Likes.findAll({
    attributes: ['placeId', 'likeId', 'UserId', 'createdAt', 'updatedAt'],
    include: [
      {
        model: Users,
        attributes: ['name'], //사용자 이름 연결
      },
    ],
    order: [['createdAt', 'DESC']],
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
