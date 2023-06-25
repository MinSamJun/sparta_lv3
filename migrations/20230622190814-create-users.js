// 마이그레이션 파일 : 스키마의 버전의 변경을 기록하고 적용하는데 사용된다.
// 스키마의 주석과 겹치는 부분은 하지 않았다.

"use strict";
// /** 이렇게 주석을 달면 타입스크립트 주석으로 인지된다. */
// sequelize-cli 패키지의 Migration 타입을 가져온다.
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  //    up :  테이블 생성 함수
  // queryInterface : 마이그레이션 API를 사용하여, 데이터베이스 작업을 수행하는 인터페이스
  // Sequelize : 데이터베이스 연결에 사용되는 인스턴스
  async up(queryInterface, Sequelize) {
    //                                테이블 명
    await queryInterface.createTable("Users", {
      userId: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key (기본키)
        type: Sequelize.INTEGER,
      },
      email: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        allowNull: false, // NOT NULL
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
  //    down : 테이블 제거 함수
  async down(queryInterface, Sequelize) {
    //                             테이블 명
    await queryInterface.dropTable("Users");
  },
};
