'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      full_name: 'Test',
      email: 'info@info.com',
      username: 'test123',
      password: '$2a$10$Zx7XgwGRCriM6j58bM2YMuh0567JJJfP64be3U3p2avugQQXKB35.', // admin123
      profile_image_url: 'https://github.com',
      age: 1,
      phone_number: 1234567890,
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
