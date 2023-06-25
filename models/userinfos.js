
// 자바스크립트 엄격모드 사용.
"use strict";

// sequelize 패키지에서 Model 이라는 클래스를 가져온다.
const { Model } = require("sequelize");

// 모듈을 정의한다.
// sequelize - 데이터베이스 연결 관리
// DataTypes - 모델의 각 속성 유형을 정의
module.exports = (sequelize, DataTypes) => {
  // Model 을 상속받아서 UserInfos 라는 모델을 만든다.
  class UserInfos extends Model {
    // 다른 모델과의 관계를 설정한다.
    static associate(models) {
      // 1. UserInfos 모델에서
      this.belongsTo(models.Users, {
        // 2. Users 모델에게 1:1 관계 설정을 합니다.
        targetKey: "userId", // 3. Users 모델의 userId 컬럼을
        foreignKey: "UserId", // 4. UserInfos 모델의 UserId 컬럼과 연결합니다.
      });
    }
  }

  // 초기화
  UserInfos.init(
    {
      userInfoId: {
        allowNull: false, // NOT NULL, 반드시 값이 있어야한다.
        autoIncrement: true, // AUTO_INCREMENT, 자동으로 증가시킨다.
        primaryKey: true, // Primary Key (기본키), 모델의 프라이머리 키이다.
        type: DataTypes.INTEGER, // 정수 타입
      },
      UserId: {
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
        unique: true, // UNIQUE, 중복되어서는 안되는 값
      },
      name: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING, // 문자열 타입
      },
      age: {
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
      },
      gender: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      profileImage: {
        type: DataTypes.STRING,
      },
      createdAt: { // 만들어진 시간
        allowNull: false, // NOT NULL
        type: DataTypes.DATE, // 데이트 타입, 날짜와 시간 정보를 나타낸다.
        defaultValue: DataTypes.NOW, // 현재 시간을 바탕으로 값을 만든다.
      },
      updatedAt: { // 최종 업데이트 시간
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { // 인스턴스와 모델의 이름 정의
      sequelize,
      modelName: "UserInfos",
    }
  );
  // 위의 내용대로 UserInfos 를 만든다.
  return UserInfos;
};
