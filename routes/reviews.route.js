const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const authMiddleware = require('../middlewares/auth-middleware');
const { Users } = require('../models');
const { Reviews } = require('../models');
const { ReviewImages } = require('../models');

// 리뷰 생성
router.post('/:placeId', authMiddleware, async (req, res) => {
  const { userId } = req.session.user;
  const { placeId } = req.params;
  const { content, rating, imageUrl } = req.body;

  // 리뷰가 이미 생성되어 있는지 확인
  const existingReview = await Reviews.findOne({
    where: { UserId: userId, PlaceId: +placeId },
  });

  if (existingReview) {
    return res.status(400).json({ message: '이미 해당 게시글에 리뷰가 생성되어 있습니다.' });
  }

  const review = await Reviews.create({
    UserId: userId,
    PlaceId: +placeId,
    content,
    rating,
  });
  if (imageUrl) {
    try {
      await ReviewImages.create({
        ReviewId: review.reviewId,
        imageUrl,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
      return;
    }
  }

  return res.status(201).json({ message: '리뷰 작성에 성공하였습니다.', data: review });
});

// 해당 리뷰 전체 목록 조회
router.get('/:placeId', async (req, res) => {
  const { placeId } = req.params;

  const reviews = await Reviews.findAll({
    where: { placeId: +placeId },
    attributes: ['reviewId', 'userId', 'placeId', 'content', 'rating', 'createdAt', 'updatedAt'],
    include: [
      {
        model: Users,
        attributes: ['name'], //사용자 이름 연결
      },
      {
        model: ReviewImages,
        attributes: ['imageUrl'],
      },
    ],
    order: [['createdAt', 'DESC']], // 내림차순 정렬
  });

  return res.status(200).json({ data: reviews });
});

// 리뷰 수정
router.put('/:reviewId', authMiddleware, async (req, res) => {
  const { reviewId } = req.params;
  const { userId } = req.session.user;
  const { content, rating, imageUrl } = req.body;

  // 리뷰를 조회합니다.
  const review = await Reviews.findOne({ where: { reviewId } });

  if (!review) {
    return res.status(404).json({ message: '리뷰가 존재하지 않습니다.' });
  } else if (review.UserId !== userId) {
    return res.status(401).json({ message: '권한이 없습니다.' }); // 해당 로그인된 사람만 수정을 할 수있음!
  }

  // 게시글의 권한을 확인하고, 게시글을 수정합니다.
  await Reviews.update(
    { content, rating },
    {
      where: {
        [Op.and]: [{ reviewId }, { UserId: userId }],
      },
    }
  );

  // req.body에 imageUrl 있다면
  // 리뷰이미지테이블에 리뷰id where 조건 같은 이미지 찾고 url수정
  if (imageUrl) {
    try {
      const updateImg = await ReviewImages.update(
        { imageUrl },
        {
          where: { ReviewId: reviewId },
        }
      );
      // console.log();
      if (!updateImg[0]) {
        await ReviewImages.create({
          ReviewId: reviewId,
          imageUrl,
        });
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  return res.status(200).json({ data: '리뷰를 수정하였습니다.' });
});

// 게시글 삭제
router.delete('/:reviewId', authMiddleware, async (req, res) => {
  const { reviewId } = req.params;
  const { userId } = req.session.user;

  // 리뷰를 조회합니다.
  const review = await Reviews.findOne({ where: { reviewId } });

  if (!review) {
    return res.status(404).json({ message: '리뷰가 존재하지 않습니다.' });
  } else if (review.UserId !== userId) {
    return res.status(401).json({ message: '권한이 없습니다.' });
  }

  // 게시글의 권한을 확인하고, 게시글을 삭제합니다.
  await Reviews.destroy({
    where: {
      [Op.and]: [{ reviewId }, { UserId: userId }],
    },
  });

  return res.status(200).json({ data: '리뷰를 삭제하였습니다.' });
});

module.exports = router;
