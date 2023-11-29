/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('EventQuota', 'event_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EventQuota');
  }
};
