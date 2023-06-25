// 미들웨어로 인증을 한다.

// jwt 패키지 호출
const jwt = require("jsonwebtoken");
// 스키마 호출
const { Users } = require("../models");

// 미들웨어 함수
// req : 요청
// res : 응답
// next : 정상적인 요청 처리를 완료 한 후, 다음 미들웨어나 라우터에 함수로 제어를 전달한다.
module.exports = async (req, res, next) => {
  try {
    // authorization 필드에 토큰 추출
    const { authorization } = req.cookies;
    // authorization 을 공백" "을 기준으로 tokenType 와 token 로 나눈다.
    const [tokenType, token] = authorization.split(" ");
    // 토큰의 타입이 Bearer 가 아니면, 경고를 내보낸다.
    if (tokenType !== "Bearer") {
      return res
        .status(401)
        .json({ message: "토큰 타입이 일치하지 않습니다." });
    }

    // 토큰의 타입이 Bearer 라면, jwt에 비밀키를 넣어서 복호화한다.
    const decodedToken = jwt.verify(token, "customized_secret_key");
    // 복호화한 것에서 userId를 추출한다.
    const userId = decodedToken.userId;

    // 토큰에서 얻은 userId와 값이 일치하는 것을 Users에서 찾는다.
    const user = await Users.findOne({ where: { userId } });
    // 일치하는 유저가 없으면 경고를 내보낸다.
    if (!user) {
      res.clearCookie("authorization");
      return res
        .status(401)
        .json({ message: "토큰 사용자가 존재하지 않습니다." });
    }
    // res.locals : 익스프레스에서 미들웨어간 데이터를 공유하기 위한 객체
    // 이곳에 위에서 찾은 userId를 넣는다.
    res.locals.user = user;

    // 정상적인 요청 처리를 완료 한 후, 다음 미들웨어나 라우터에 함수로 제어를 전달한다.
    next();
  }
  // 위의 것들이 실패했을 경우의 에러 메시지
  catch (error) {
    res.clearCookie("authorization");
    return res.status(401).json({
      message: "비정상적인 요청입니다.",
    });
  }
};
