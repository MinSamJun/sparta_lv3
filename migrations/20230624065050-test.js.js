// 마이그레이션 파일 : 스키마의 버전의 변경을 기록하고 적용하는데 사용된다.

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // renameColumn 매서드를 사용하여, Users 테이블의 email 컬럼을 nickname 라는 이름으로 바꾼다.
    await queryInterface.renameColumn("Users", "email", "nickname");
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },
  // 롤백작업 내용물이 없으므로, 아무 작업도 하지 않는다.
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
