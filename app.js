// 원본 : https://github.com/leeseungjun97/sparta_blog_with_mysql

// JSON 파일에는 주석을 달 수 없으므로, ./config/config.json 의 설명은 여기서 한다.
// MySQL 데이터베이스와 연결하기 위한 설정 파일이다.

// {
//   "환경명1": {
//     사용자 이름
//     "username": "master",
//     비밀번호
//     "password": "4321aaaa",
//     db의 이름
//     "database": "BLOG",
//     db 서버의 엔드포인트
//     "host": "database-1.ctcyyju0ub4c.ap-northeast-2.rds.amazonaws.com",
//     db의 타입
//     "dialect": "mysql"
//   },
//   "환경명2": {
//     "username": "root",
//     테스트 환경이기 때문에 비밀번호 생략
//     "password": null,
//     "database": "database_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "환경명3": {
//     "username": "root",
//     "password": null,
//     "database": "database_production",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   }
// }

// 이하 app.js의 주석

// 패키지를 가져온다.
const express = require("express");
const cookieParser = require("cookie-parser");

// 라우터를 연결한다.
const usersRouter = require("./routes/users.route");
const postsRouter = require("./routes/posts.route");

// 객체 생성
const app = express();

// 포트 연결
const PORT = 3018;

// 미들웨어 : 파싱을 위해 가져오는 녀석들
app.use(express.json());
app.use(cookieParser());

// /api로 오는 요청을 위에서 연결한 라우터로 보낸다.
app.use("/api", [usersRouter, postsRouter]);

// 3018 포트로 연결한다.
app.listen(PORT, () => {
  console.log(PORT, "포트 번호로 서버가 실행되었습니다.");
});
