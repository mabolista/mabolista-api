const Event = require('./Event');

module.exports = (sequelize, DataTypes) => {
  const EventQuota = sequelize.define(
    'EventQuota',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'event_id',
        references: {
          model: Event,
          key: 'id'
        }
      },
      playerQty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'player_qty'
      },
      keeperQty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'keeper_qty'
      },
      playerAvailableQty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'player_available_qty'
      },
      keeperAvailableQty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'keeper_available_qty'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      tableName: 'event_quota'
    }
  );

  return EventQuota;
};
