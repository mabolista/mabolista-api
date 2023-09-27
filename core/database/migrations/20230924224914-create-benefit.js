/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('benefits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'image_url'
      },
      imagePublicId: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'image_public_id'
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
    await queryInterface.dropTable('benefits');
  }
};
