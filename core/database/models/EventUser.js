const User = require('./UserModel');
const Event = require('./Event');

module.exports = (sequelize, DataTypes) => {
  const EventUser = sequelize.define(
    'EventUser',
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
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'user_id',
        references: {
          model: User,
          key: 'id'
        }
      },
      playerPosition: {
        type: DataTypes.ENUM('P', 'GK'),
        allowNull: false,
        field: 'player_position'
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
      tableName: 'events_users'
    }
  );
  return EventUser;
};
