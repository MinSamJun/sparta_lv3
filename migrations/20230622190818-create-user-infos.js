// 마이그레이션 파일 : 스키마의 버전의 변경을 기록하고 적용하는데 사용된다.
// 스키마의 주석과 겹치는 부분은 하지 않았다.

"use strict";

// /** 타입스크립트 주석으로 인식 */
// sequelize-cli 패키지의 Migration 타입을 가져온다.
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // up : 테이블 생성 함수
  // queryInterface : 마이그레이션 API를 사용하여, 데이터베이스 작업을 수행하는 인터페이스
  // Sequelize : 데이터베이스 연결에 사용되는 인스턴스
  async up(queryInterface, Sequelize) {
    // UserInfos 라는 테이블 생성
    await queryInterface.createTable("UserInfos", {
      userInfoId: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key (기본키)
        type: Sequelize.INTEGER,
      },
      UserId: {
        allowNull: false, // NOT NULL
        type: Sequelize.INTEGER,
        unique: true, // UNIQUE
        references: {
          model: "Users", // Users 모델을 참조합니다.
          key: "userId", // Users 모델의 userId를 참조합니다.
        },
        onDelete: "CASCADE", // 만약 Users 모델의 userId가 삭제되면, UserInfos 모델의 데이터가 삭제됩니다.
      },
      name: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING,
      },
      age: {
        allowNull: false, // NOT NULL
        type: Sequelize.INTEGER,
      },
      gender: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING,
      },
      profileImage: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false, // NOT NULL
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false, // NOT NULL
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  // 롤백작업 : DB를 이전 상태로 되돌린다.
  // down : 테이블 제거 함수
  async down(queryInterface, Sequelize) {
    // UserInfos 라는 테이블 생서
    await queryInterface.dropTable("UserInfos");
  },
};
