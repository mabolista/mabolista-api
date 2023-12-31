module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    'Event',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false
      },
      gmapsUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'gmaps_url'
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      playerPrice: {
        type: DataTypes.DECIMAL(15, 2).UNSIGNED,
        allowNull: false,
        field: 'player_price'
      },
      keeperPrice: {
        type: DataTypes.DECIMAL(15, 2).UNSIGNED,
        allowNull: false,
        field: 'keeper_price'
      },
      eventDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'event_date'
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
        field: 'start_time'
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        field: 'end_time'
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
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'deleted_at'
      }
    },
    {
      tableName: 'events'
    }
  );
  Event.associate = (models) => {
    Event.belongsToMany(models.Benefit, {
      through: 'EventBenefit',
      as: 'benefits',
      foreignKey: 'event_id'
    });
    Event.belongsToMany(models.User, {
      through: 'EventUser',
      as: 'users',
      foreignKey: 'event_id'
    });
    Event.hasOne(models.EventQuota, {
      foreignKey: 'eventId',
      as: 'eventQuota'
    });
  };
  return Event;
};
