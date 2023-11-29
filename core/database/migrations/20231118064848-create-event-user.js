/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('events_users', {
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
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'user_id',
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'id'
        }
      },
      playerPosition: {
        type: Sequelize.ENUM('P', 'GK'),
        allowNull: false,
        field: 'player_position'
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
    await queryInterface.dropTable('events_users');
  }
};
