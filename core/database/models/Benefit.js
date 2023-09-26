const { Model, DataTypes } = require('sequelize');
const databaseConnection = require('../config/databaseConnection');

class Benefit extends Model {}

Benefit.init(
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
    tableName: 'benefits',
    timestamps: true,
    sequelize: databaseConnection
  }
);

module.exports = Benefit;
