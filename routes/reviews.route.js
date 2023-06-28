const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const authMiddleware = require("../middlewares/auth-middleware");
const { Users } = require("../models");
const { Reviews } = require("../models");

// 리뷰 생성
router.post("/:placeId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { placeId } = req.params;
  const { content, rating } = req.body;

  // 리뷰가 이미 생성되어 있는지 확인
  const existingReview = await Reviews.findOne({
    where: { UserId: userId, PlaceId: +placeId },
  });

  if (existingReview) {
    return res
      .status(400)
      .json({ message: "이미 해당 게시글에 리뷰가 생성되어 있습니다." });
  }

  const review = await Reviews.create({
    UserId: userId,
    PlaceId: +placeId,
    content,
    rating,
  });

  return res
    .status(201)
    .json({ message: "리뷰 작성에 성공하였습니다.", data: review });
});

// 해당 리뷰 전체 목록 조회
router.get("/", async (req, res) => {
  const reviews = await Reviews.findAll({
    attributes: [
      "reviewId",
      "userId",
      "placeId",
      "content",
      "rating",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: Users,
        attributes: ["name"], //사용자 이름 연결
      },
    ],
    order: [["createdAt", "DESC"]], // 내림차순 정렬
  });

  return res.status(200).json({ data: reviews });
});

// 리뷰 수정
router.put("/:reviewId", authMiddleware, async (req, res) => {
  const { reviewId } = req.params;
  const { userId } = res.locals.user;
  const { content, rating } = req.body;

  // 리뷰를 조회합니다.
  const review = await Reviews.findOne({ where: { reviewId } });

  if (!review) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  } else if (review.UserId !== userId) {
    return res.status(401).json({ message: "권한이 없습니다." }); // 해당 로그인된 사람만 수정을 할 수있음!
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

  return res.status(200).json({ data: "리뷰를 수정하였습니다." });
});

// 게시글 삭제
router.delete("/:reviewId", authMiddleware, async (req, res) => {
  const { reviewId } = req.params;
  const { userId } = res.locals.user;

  // 리뷰를 조회합니다.
  const review = await Reviews.findOne({ where: { reviewId } });

  if (!review) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  } else if (review.UserId !== userId) {
    return res.status(401).json({ message: "권한이 없습니다." });
  }

  // 게시글의 권한을 확인하고, 게시글을 삭제합니다.
  await Reviews.destroy({
    where: {
      [Op.and]: [{ reviewId }, { UserId: userId }],
    },
  });

  return res.status(200).json({ data: "리뷰를 삭제하였습니다." });
});

module.exports = router;
