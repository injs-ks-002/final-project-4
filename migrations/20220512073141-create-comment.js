'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      PhotoId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      comment: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => {
      queryInterface.addConstraint('Comment', {
          fields: ['UserId'],
          type: "foreign key",
          name: "user_fk",
          references: {
            table: "Users",
            field: "id",
          },
          onDelete: "cascade",
          onUpdate: "cascade",
        }),
        queryInterface.addConstraint('Comment', {
          fields: ['PhotoId'],
          type: "foreign key",
          name: "photo_fk",
          references: {
            table: "Photos",
            field: "id",
          },
          onDelete: "cascade",
          onUpdate: "cascade",
        })
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comment');
  }
};