'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Photos', [{
      title: 'Test',
      caption: 'this only test',
      poster_image_url: 'https://github.com',
      UserId: 1,
      createdAt: '2022-06-05 18:45:17.046000 +00:00',
      updatedAt: '2022-06-05 18:45:17.046000 +00:00'
  }], {})
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
