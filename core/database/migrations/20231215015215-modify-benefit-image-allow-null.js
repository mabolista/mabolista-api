/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('benefits', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('benefits', 'image_public_id', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('benefits', 'image_public_id');
    await queryInterface.changeColumn('benefits', 'image_public_id');
  }
};
