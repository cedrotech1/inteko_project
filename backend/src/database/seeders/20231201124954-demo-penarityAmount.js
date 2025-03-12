'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PenarityAmounts', [
      {
        amount: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PenarityAmounts', null, {});
  }
};
