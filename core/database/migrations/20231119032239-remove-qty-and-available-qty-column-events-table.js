/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('events', 'qty'),
      queryInterface.removeColumn('events', 'available_qty')
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('events', 'qty', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.addColumn('events', 'available_qty', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      })
    ]);
  }
};
