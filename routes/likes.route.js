const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Likes } = require("../models");
const { Places } = require("../models");

// 개념 맛집플레이스에 해당 사용자가 좋아요를 했는지

// 좋아요 확인하기
router.get("/:userId", async (req, res) => {
  const likes = await Places.findAll({
    attributes: ["placeId", "likeId", "UserId", "createdAt", "updatedAt"],
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ data: likes });
});

// 좋아요 만들기
router.post("/:placeId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { placeId } = req.params;

  // 이미 좋아한 경우엔 기존 값 반환
  const existingLike = await Likes.findOne({
    where: { PlaceId: +placeId, UserId: userId },
  });
  if (existingLike) {
    await Likes.destroy({
      where: {
        [Op.and]: [{ PlaceId: +placeId }, { UserId: userId }],
      },
    });
    return res.status(200).json({ data: "좋아요를 삭제하였습니다." });
  }

  const newLike = await Reviews.create({
    UserId: userId,
    PlaceId: +placeId,
    likesCount: 1,
  });

  return res
    .status(201)
    .json({ message: "좋아요에 성공하였습니다.", data: newLike });
});

// // 좋아요 만들기
// router.post("/:placeId", authMiddleware, async (req, res) => {
//   const { userId } = res.locals.user;
//   const { placeId } = req.params;

//   // 이미 좋아한 경우엔 기존 값 반환
//   const existingLike = await Likes.findOne({
//     where: { PlaceId: +placeId, UserId: userId },
//   });
//   if (existingLike) {
//     await Likes.destroy({
//       where: {
//         [Op.and]: [{ PlaceId: +placeId }, { UserId: userId }],
//       },
//     });
//     existingLike.likesCount--; // 좋아요 수 감소
//     res.status(200).json({
//       liked: false,
//       likesCount: existingLike.likesCount,
//     });
//     return;
//   }

//   // 좋아요 생성
//   const newLike = await Likes.create({
//     PlaceId: +placeId,
//     UserId: userId,
//     likesCount: 1, // 좋아요 수 초기화
//   });
//   res.status(200).json({
//     liked: true,
//     likesCount: newLike.likesCount,
//   });
// });

// 좋아요 수가 많아지면 조회할때 문제가 생길 것 같은데 어떻게 해야할까요?

module.exports = router;
