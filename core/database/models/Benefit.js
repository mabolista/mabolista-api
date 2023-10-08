module.exports = (sequelize, DataTypes) => {
  const Benefit = sequelize.define(
    'Benefit',
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'image_url'
      },
      imagePublicId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'image_public_id'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at'
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at'
      }
    },
    {
      tableName: 'benefits'
    }
  );
  Benefit.associate = (models) => {
    Benefit.belongsToMany(models.Event, {
      through: 'EventBenefit',
      as: 'events',
      foreignKey: 'benefit_id'
    });
  };
  return Benefit;
};
