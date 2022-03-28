'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Todos', 'dueDate', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    }); 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Todos', 'dueDate');
  }
};
