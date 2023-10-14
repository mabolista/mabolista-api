/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gmapsUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'gmaps_url'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      playerPrice: {
        type: Sequelize.DECIMAL(15, 2).UNSIGNED,
        allowNull: false,
        field: 'player_price'
      },
      keeperPrice: {
        type: Sequelize.DECIMAL(15, 2).UNSIGNED,
        allowNull: false,
        field: 'keeper_price'
      },
      eventDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        field: 'event_date'
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
        field: 'start_time'
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false,
        field: 'end_time'
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
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: 'deleted_at'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('events');
  }
};
