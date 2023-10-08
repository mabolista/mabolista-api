const Benefit = require('./Benefit');
const Event = require('./Event');

module.exports = (sequelize, DataTypes) => {
  const EventBenefit = sequelize.define(
    'EventBenefit',
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
      tableName: 'event_benefits'
    }
  );
  return EventBenefit;
};
