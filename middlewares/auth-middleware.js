const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = async (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) {
    res
      .status(400)
      .json({ message: "토큰이 없습니다. 로그인을 해주시길 바랍니다." });
  }
  const [tokenType, token] = authorization.split(" ");
  if (tokenType !== "Bearer" || !token) {
    res.status(401).json({
      message: "토큰타입이 일치하지 않거나 토큰이 존재하지 않습니다.",
    });
    return;
  }
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.userId;

    const user = await Users.findOne({ where: { userId } });

    if (!user) {
      res
        .status(401)
        .json({ message: "토큰에 해당하는 사용자가 존재하지 않습니다." });
      return;
    }
    res.locals.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "비정상적인 접근입니다.",
    });
    return;
  }
};
