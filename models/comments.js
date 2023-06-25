// 자바스크립트 엄격모드 적용
"use strict";

// sequelize 패키지에서 Model 이라는 클래스를 가져온다.
const { Model } = require("sequelize");

// 모듈을 정의한다.
// sequelize - 데이터베이스 연결 관리
// DataTypes - 모델의 각 속성 유형을 정의
module.exports = (sequelize, DataTypes) => {
  // Model 을 상속받아서 Comments 라는 모델을 만든다.
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    // 다른 모델과의 관계를 설정한다.
    static associate(models) {
      // define association here

      // 1. Comments 모델에서
      this.belongsTo(models.Users, {
        // 2. Users 모델에게 N:1 관계 설정을 합니다.
        targetKey: "userId", // 3. Users 모델의 userId 컬럼을
        foreignKey: "UserId", // 4. Comments 모델의 UserId 컬럼과 연결합니다.
      });

      // 1. Comments 모델에서
      this.belongsTo(models.Posts, {
        // 2. Posts 모델에게 N:1 관계 설정을 합니다.
        targetKey: "postId", // 3. Posts 모델의 postId 컬럼을
        foreignKey: "PostId", // 4. Comments 모델의 PostId 컬럼과 연결합니다.
      });
    }
  }

  Comments.init(
    {
      Id: {
        allowNull: false, // NOT NULL, 반드시 있어야 하는 값
        autoIncrement: true, // AUTO_INCREMENT, 자동으로 증가시킨다.
        primaryKey: true, // Primary Key (기본키), 프라이머리 키이다.
        type: DataTypes.INTEGER, // 정수 타입
      },
      UserId: {
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
      },
      PostId: {
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
      },
      comment: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING, // 문자열타입
      },
      createdAt: { // 생성 시간
        allowNull: false, // NOT NULL
        type: DataTypes.DATE, // 날짜타입, 날짜와 시간 정보를 나타낸다.
        defaultValue: DataTypes.NOW, // 현재 시간으로 값을 만든다.
      },
      updatedAt: { // 최종 수정 시간
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { // 인스턴스와 모델의 이름 정의
      sequelize,
      modelName: "Comments",
    }
  );
  // 이상의 내용으로 Comments를 만든다.
  return Comments;
};
