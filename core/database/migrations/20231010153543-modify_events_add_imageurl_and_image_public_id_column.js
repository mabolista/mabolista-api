/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('events', 'image_url', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      }),
      queryInterface.addColumn('events', 'image_public_id', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      })
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('events', 'image_url'),
      queryInterface.removeColumn('events', 'image_public_id')
    ]);
  }
};
