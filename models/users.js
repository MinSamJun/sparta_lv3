
// 자바스크립트 엄격모드 사용.
"use strict";

// sequelize 패키지에서 Model 이라는 클래스를 가져온다.
const { Model } = require("sequelize");

// 모듈을 정의한다.
// sequelize - 데이터베이스 연결 관리
// DataTypes - 모델의 각 속성 유형을 정의
module.exports = (sequelize, DataTypes) => {
  // Model 을 상속받아서 Users 라는 모델을 만든다.
  class Users extends Model {
    // 다른 모델과의 관계를 설정한다.
    static associate(models) {
      // define association here

      // 1. Users 모델에서
      this.hasOne(models.UserInfos, {
        // 2. UserInfos 모델에게 1:1 관계 설정을 합니다.
        sourceKey: "userId", // 3. Users 모델의 userId 컬럼을
        foreignKey: "UserId", // 4. UserInfos 모델의 UserId 컬럼과 연결합니다.
      });

      // 1. Users 모델에서
      this.hasMany(models.Posts, {
        // 2. Posts 모델에게 1:N 관계 설정을 합니다.
        sourceKey: "userId", // 3. Users 모델의 userId 컬럼을
        foreignKey: "UserId", // 4. Posts 모델의 UserId 컬럼과 연결합니다.
      });

      // 1. Users 모델에서
      this.hasMany(models.Comments, {
        // 2. Comments 모델에게 1:N 관계 설정을 합니다.
        sourceKey: "userId", // 3. Users 모델의 userId 컬럼을
        foreignKey: "UserId", // 4. Comments 모델의 UserId 컬럼과 연결합니다.
      });
    }
  }

  // 초기화
  Users.init(
    { // 모델의 스키마 정의
      userId: {
        allowNull: false, // NOT NULL, 반드시 값이 있어야한다.
        autoIncrement: true, // AUTO_INCREMENT, 자동으로 증가시킨다.
        primaryKey: true, // Primary Key (기본키), 모델의 프라이머리 키이다.
        type: DataTypes.INTEGER, // 정수 타입 타입
      },
      nickname: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING, // 문자열 타입
        unique: true, // 값이 중복되어서는 안된다.
      },
      password: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      createdAt: { // 만들어진 시간
        allowNull: false, // NOT NULL
        type: DataTypes.DATE, // 데이트 타입, 날짜와 시간 정보를 나타낸다.
        defaultValue: DataTypes.NOW, // 현재 시간을 바탕으로 값을 만든다.
      },
      updatedAt: { // 마지막으로 수정한 시간
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { // 인스턴스와 모델의 이름 정의
      sequelize,
      modelName: "Users",
    }
  );
  // 위의 내용들을 담아서 Users를 만든다.
  return Users;
};
