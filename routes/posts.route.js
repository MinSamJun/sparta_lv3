
// 패키지 호출
const express = require("express");
// 패키지를 호출함과 동시에, 객체 생성
const { Op } = require("sequelize");
// 스키마를 가져온다.
const { Posts, Users } = require("../models");
// 미들웨어를 가져온다.
const authMiddleware = require("../middlewares/auth-middleware");
// 라우터 객체 생성
const router = express.Router();

// 게시글 생성
// /post 로 요청이 들오어면, 미들웨어로 인증을 한다.
router.post("/posts", authMiddleware, async (req, res) => {
  // 미들웨어에서 아이디를 가져온다.
  const { userId } = res.locals.user;
  // 클라이언트에서 제목과, 내용을 입력받는다.
  const { title, content } = req.body;

  // 아래의 내용물로 게시글을 만든다.
  const post = await Posts.create({
    UserId: userId,
    title,
    content,
  });

  return res.status(201).json({ data: post });
});

// 게시글 목록 조회
// /posts로 온 요청으로 게시글 목록을 조회한다.
router.get("/posts", async (req, res) => {
  // 전부 다 가져온다.
  const posts = await Posts.findAll({
    // 가져올 속성들
    attributes: ["postId", "title", "createdAt"],
    // Users 모델과의 관계 설정
    include: [
      {
        model: Users,
        // 닉네임 필드를 가져온다.
        attributes: ["nickname"],
      },
    ],
    // 만들어진 날짜를 기준으로, 내림차순 정렬한다.
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ data: posts });
});

// 게시글 상세 조회
// /posts 에서 게시글의 ID를 입력 받은 경우, 상세 정보를 보여준다.
router.get("/posts/:postId", async (req, res) => {
  // 파람에서 게시글의 아이드를 가져온다.
  const { postId } = req.params;
  // 일치하는 게시글 하나를 찾는다.
  const post = await Posts.findOne({
    // 가져올 속성들
    attributes: ["postId", "title", "content", "createdAt", "updatedAt"],
    // postId로 찾는다.
    where: { postId },
  });

  return res.status(200).json({ data: post });
});

// 게시글 수정
// /posts 에서 게시글 id를 입력받으면 수정을 한다.
// put은 전체를 입력받고, 입력이 안된것은 비워버리므로 조심해야한다.
// 또는 patch로 바꾼다.        미들웨어로 인증
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  // 미들웨어서 유저id를 가져온다
  const { userId } = res.locals.user;
  // 파람에서 게시글id를 받아온다.
  const { postId } = req.params;
  // 클라리언트에서 제목과 내용을 받아온다.
  const { title, content } = req.body;

  // 아이디가 같은 게시글을 찾는다.
  const post = await Posts.findOne({ where: { postId } });
  // 없으면 경고를 띄운다.
  if (!post) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  }
  // 게시한 사람과 수정하려는 사람이 달라도 경고를 띄운다.
  else if (post.UserId !== userId) {
    return res.status(404).json({ message: "수정할 권한이 없습니다." });
  }

  // 게시글을 작성한 사람이 맞다면, 업데이트를 한다.
  await Posts.update(
    { title, content },
    {
      where: {
        [Op.and]: [{ postId }, [{ UserId: userId }]],
      },
    }
  );
  res.status(200).json({ data: "게시글이 수정되었습니다." });
});

// 게시글 삭제
// /post 로 게시글id를 입력받고 삭제한다.
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  // 미들웨어로 유저id를 받는다.
  const { userId } = res.locals.user;
  // 파람에서 게시글 id를 받는다.
  const { postId } = req.params;
  // 클라이언트에서 비밀번호를 입력받는다.
  // const { password } = req.body; // 아래에서 비밀번호를 입력받지 않음으로 주석처리

  // 게시글id가 같은 것을 하나 찾는다.
  const post = await Posts.findOne({ where: { postId } });
  // 없으면 경고
  if (!post) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  }
  // 작성자와 삭제요청자가 다른 경우에도 경고
  else if (post.UserId !== userId) {
    return res.status(404).json({ message: "수정할 권한이 없습니다." });
  }

  // 게시글이 있고, 작성자가 삭제를 요청한게 맞다면 삭제한다.
  await Posts.destroy({ where: { postId } });

  res.status(200).json({ data: "게시글이 삭제되었습니다." });
});

// 현재 라우터를 모듈로 내보낸다.
module.exports = router;
