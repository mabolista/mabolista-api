/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EventQuota', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
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
      player_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'player_qty'
      },
      keeper_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'keeper_qty'
      },
      player_available_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'player_available_qty'
      },
      keeper_available_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'keeper_available_qty'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EventQuota');
  }
};
