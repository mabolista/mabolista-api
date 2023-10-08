const { Model, DataTypes } = require('sequelize');
const databaseConnection = require('../config/databaseConnection');
const Event = require('./Event');
const Benefit = require('./Benefit');

class EventBenefit extends Model {
  static associate(models) {
    // define association here
    EventBenefit.belongsTo(models.Event, {
      foreignKey: 'event_id',
      targetKey: 'id'
    });

    EventBenefit.belongsTo(models.Benefit, {
      foreignKey: 'benefit_id',
      targetKey: 'id'
    });
    // this.belongsTo(models.Event);
    // this.belongsTo(models.Benefit);
  }
}

EventBenefit.init(
  {
    eventId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'event_id',
      references: {
        model: Event,
        key: 'id'
      }
    },
    benefitId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'benefit_id',
      references: {
        model: Benefit,
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  },
  {
    modelName: 'EventBenefit',
    timestamps: false,
    sequelize: databaseConnection
  }
);

module.exports = EventBenefit;
