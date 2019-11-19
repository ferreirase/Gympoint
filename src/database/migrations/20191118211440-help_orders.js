'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('help_orders', { 
        id: {
          type: Sequelize.INTEGER, 
          autoIncrement: true, 
          primaryKey: true, 
          allowNull: false
        }, 
        student_id: {
          type: Sequelize.INTEGER, 
          references: {model: 'students', key: 'id'}, 
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE', 
          allowNull: false
        },
        question: {
          type: Sequelize.TEXT, 
          allowNull: false, 
        },
        answer: {
          type: Sequelize.TEXT, 
          allowNull: true, 
        },
        answer_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        }
      });
  },

  down: (queryInterface) => {
      return queryInterface.dropTable('help_orders');
  }
};
