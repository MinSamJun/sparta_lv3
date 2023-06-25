
// 자바스크립트 엄격모드 적용
'use strict';

// Node.js 의 모듈을 불러온다.
//    fs : 파일 및 디렉터리에 대한 작업을 수행하는 함수를 제공한다.
const fs = require('fs');
//    path :  파일 경로에 대한 함수를 제공한다.
const path = require('path');
//    process : 현재 실행중인 프로세스의 정보를 제공하고, 제어할 수 있다.
const process = require('process');

// 패키지 불러오기
const Sequelize = require('sequelize');

//  현재 파일의 기본이 이름을 가져온다.
const basename = path.basename(__filename);
// 현재 실행환경을 설정한다.            기본값
const env = process.env.NODE_ENV || 'development';
// __dirname : node.js의 전역변수 중 하나.
// 현재 디렉터리의 파일명을 가져온다.
const config = require(__dirname + '/../config/config.json')[env];
// 빈 db를 만든다.
const db = {};

// 인스턴스 생성
let sequelize;

// config.use_env_variable 가 존재한다면,
if (config.use_env_variable) {
  // process.env[config.use_env_variable] 에서 데이터베이스 연결을 가져온다.
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
}
// 없다면,
else {
  // config 에서 정보(database, username, password)를 가져와서 인스턴트슬 생성한다.
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  // 현재 디렉터리의 파일명을 가져온다.
  .readdirSync(__dirname)
  // 필터링한다.
  .filter(file => {
    return (
      //  .indexOf 특정 문자열 또는 문자의 첫번째 인덱스를 반환한다.
      file.indexOf('.') !== 0 && // . 으로 시작하지 않음 = 숨김파일 제외
      file !== basename && // 파일 이름이 베이스네임이 아님 = 현재 모듈 파일 제외
      file.slice(-3) === '.js' && // 뒤에서 세 글자가 .js = 자바스크립트 파일
      file.indexOf('.test.js') === -1 // 파일명에 .test.js 가 없어야한다.
    );
  })

  // 위에서 선택된 파일들에 대해서 forEach를 돈다.
  .forEach(file => {
    //require : 경로의 모듈을 가져와서 함수로 호출한다.
    //path.~~~~ : 경로를 만든다.
    //(sequelize, Sequelize.DataTypes) : require 로 가져온 모듈에 넣을 매개변수
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    // db에 모델을 추가한다.
    db[model.name] = model;
  });

// 각 배열 요소들에 대해 반복한다.
Object.keys(db).forEach(modelName => {
  // 해당 모델에 associate 모델이 있다면,
  if (db[modelName].associate) {
    // associate를 호출한다.
    // associate : 모델간의 관계를 정하는 매서드.
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; // 인스턴스 할당
db.Sequelize = Sequelize; // 패키지가 할당 된 변수를 db의 Sequelize라는 속성에 할당한다.

// db 객체를 모듈로 내보낸다
module.exports = db;
