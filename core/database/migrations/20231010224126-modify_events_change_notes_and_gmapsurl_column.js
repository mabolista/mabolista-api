/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('events', 'gmaps_url', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('events', 'notes', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('events', 'gmaps_url'),
      queryInterface.removeColumn('events', 'notes')
    ]);
  }
};
