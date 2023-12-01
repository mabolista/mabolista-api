/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('EventQuota', 'event_quota');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('event_quota');
  }
};
