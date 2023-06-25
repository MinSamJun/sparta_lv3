
// 자바스크립트 엄격모드
"use strict";

// sequelize 패키지에서 Model 이라는 클래스를 가져온다.
const { Model } = require("sequelize");

// 모듈을 정의한다.
// sequelize - 데이터베이스 연결 관리
// DataTypes - 모델의 각 속성 유형을 정의
module.exports = (sequelize, DataTypes) => {
  // Model 을 상속받아서 Posts 라는 모델을 만든다.
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // 다른 모델과의 관계를 설정한다.
    static associate(models) {
      // define association here

      // 1. Posts 모델에서
      this.belongsTo(models.Users, {
        // 2. Users 모델에게 N:1 관계 설정을 합니다.
        targetKey: "userId", // 3. Users 모델의 userId 컬럼을
        foreignKey: "UserId", // 4. Posts 모델의 UserId 컬럼과 연결합니다.
      });

      // 1. Posts 모델에서
      this.hasMany(models.Comments, {
        // 2. Comments 모델에게 1:N 관계 설정을 합니다.
        sourceKey: "postId", // 3. Posts 모델의 postId 컬럼을
        foreignKey: "PostId", // 4. Comments 모델의 PostId 컬럼과 연결합니다.
      });
    }
  }

  Posts.init(
    {
      postId: {
        allowNull: false, // NOT NULL, 꼭 있어야하는 값
        autoIncrement: true, // AUTO_INCREMENT, 자동 증가
        primaryKey: true, // Primary Key (기본키), 프라이머리 키
        type: DataTypes.INTEGER, // 정수 값
      },
      UserId: {
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING, // 문자열
      },
      content: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      createdAt: { // 만들어진 타이밍
        allowNull: false, // NOT NULL
        type: DataTypes.DATE, // 데이트 타입, 날짜와 시간 정보를 나타낸다.
        defaultValue: DataTypes.NOW, // 현재 시간을 바탕으로 값을 만든다.
      },
      updatedAt: { // 마지막 수정 타임
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { // 인스턴스와 모델의 이름 정의
      sequelize,
      modelName: "Posts",
    }
  );
  // 이상의 내용으로 Posts를 만든다.
  return Posts;
};
