
// 패키지 가져오기
const express = require("express");
const jwt = require("jsonwebtoken");
// 스키마 가져오기
const { Users, UserInfos } = require("../models");
// 라우터 생성하기
const router = express.Router();

// 로그인
//                    비동기
router.post("/login", async (req, res) => {
  // 바디에서 nickname 과 password 를 객체 분해 할당 한다.
  const { nickname, password } = req.body;
  //           동기   모델  하나찾기           닉네임 일치
  const user = await Users.findOne({ where: { nickname } });

  // 닉네임과 비밀번호가 유효한지 확인하기
  // 같은 닉네임이 없다면
  if (!user) {
    return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
  }
  // 같은 닉네임이 있지만 비밀번호가 다르다면
  else if (user.password !== password) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }
  // 위의 과정을 모두 통과 = 닉네임과 비밀번호가 유효하다면, 토큰을 생성한다.
  const token = jwt.sign(
    {
      userId: user.userId,
    },
    "customized_secret_key" // 비밀키
  );
  //토큰을 쿠키로 만든다,      쿠키명      토큰
  res.cookie("authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "로그인 성공", userId: user.userId });
});

// 회원가입
// 클라이언트에서 준 정보 처리
router.post("/users", async (req, res) => {
  const {
    nickname,
    password,
    confirmPassword,
    name,
    age,
    gender,
    profileImage,
  } = req.body;

  // 정규식을 활용하여, 입력받은 닉네임이 조건을 만족하는지 체크한다.
  const regex = /^[a-zA-Z0-9]{3,}$/;
  const idCheck = regex.test(nickname);

  // 닉네임이 조건을 만족하지 않는다면,
  if (!idCheck) {
    res.status(400).json({
      // 경고문을 띄운다.
      errorMessage:
        "nickname을 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9) 으로 작성하세요",
    });
    return;
  }

  // 비밀번호 조건 검증. 4자 이상 || 닉네임을 포함하지 않을 것
  if (password.length < 4 || password.includes(nickname)) {
    res.status(400).json({
      errorMessage:
        "password를 nickname 을 포함하지 않으면서 최소 4자 이상으로 작성하세요",
    });
    return;
  }

  // 패스워드를 똑같이 두 번 입력하지 않은 경우
  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: "password가 confirmPassword과 다릅니다.",
    });
    return;
  }

  // 같은 닉네임이 있는지 검색한다.
  const isExistUser = await Users.findOne({ where: { nickname } });

  // 존재한다면 경고를 띄운다.
  if (isExistUser) {
    return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
  }

  // Users 테이블에 사용자를 추가합니다.
  const user = await Users.create({ nickname, password });
  // UserInfos 테이블에 사용자 정보를 추가합니다.
  const userInfo = await UserInfos.create({
    UserId: user.userId, // 생성한 유저의 userId를 바탕으로 사용자 정보를 생성합니다.
    name,
    age,
    gender: gender.toUpperCase(), // 성별을 대문자로 변환합니다.
    profileImage,
  });

  return res.status(201).json({ message: "회원가입이 완료되었습니다." });
});

// 사용자 조회
// 파람에서 id를 받는다.
router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;


  const user = await Users.findOne({
    // 검색 결과에서 가져올 속성들
    attributes: ["userId", "nickname", "createdAt", "updatedAt"],
    include: [
      {
        model: UserInfos, // 1:1 관계를 맺고있는 UserInfos 테이블을 조회합니다.
        // 반환할 테이블
        attributes: ["name", "age", "gender", "profileImage"],
      },
    ],
    // 검색 조건은 유저ID이다.
    where: { userId },
  });

  return res.status(200).json({ data: user });
});

// 현재 라우터를 모듈로 내보낸다.
module.exports = router;
