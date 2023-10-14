/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('event_benefits', {
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'event_id',
        references: {
          model: {
            tableName: 'events'
          },
          key: 'id'
        }
      },
      benefitId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'benefit_id',
        references: {
          model: {
            tableName: 'benefits'
          },
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('event_benefits');
  }
};
