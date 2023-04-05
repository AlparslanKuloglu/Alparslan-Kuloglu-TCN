'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('categories', [
      {
        "category_id": 1,
        "title": "Roman",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "category_id": 2,
        "title": "Kişisel Gelişim",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "category_id": 3,
        "title": "Bilim",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "category_id": 4,
        "title": "Din Tasavvuf",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "category_id": 5,
        "title": "Öykü",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "category_id": 6,
        "title": "Felsefe",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },

    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('products', null, {});
     */
  }
};
