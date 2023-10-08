// const { Model, DataTypes } = require('sequelize');
const { Model, DataTypes } = require('sequelize');
const databaseConnection = require('../config/databaseConnection');
// const Benefit = require('./Benefit');
// const EventBenefit = require('./EventBenefit');

// class Event extends Model {}

// Event.init(
//   {
//     id: {
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true,
//       type: DataTypes.INTEGER
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: false
//     },
//     location: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     gmapsUrl: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       field: 'gmaps_url'
//     },
//     notes: {
//       type: DataTypes.TEXT,
//       allowNull: false
//     },
//     playerPrice: {
//       type: DataTypes.DECIMAL(15, 2).UNSIGNED,
//       allowNull: false,
//       field: 'player_price'
//     },
//     keeperPrice: {
//       type: DataTypes.DECIMAL(15, 2).UNSIGNED,
//       allowNull: false,
//       field: 'keeper_price'
//     },
//     eventDate: {
//       type: DataTypes.DATEONLY,
//       allowNull: false,
//       field: 'event_date'
//     },
//     startTime: {
//       type: DataTypes.TIME,
//       allowNull: false,
//       field: 'start_time'
//     },
//     endTime: {
//       type: DataTypes.TIME,
//       allowNull: false,
//       field: 'end_time'
//     },
//     createdAt: {
//       allowNull: false,
//       type: DataTypes.DATE,
//       field: 'created_at'
//     },
//     updatedAt: {
//       allowNull: false,
//       type: DataTypes.DATE,
//       field: 'updated_at'
//     },
//     deletedAt: {
//       allowNull: true,
//       type: DataTypes.DATE,
//       field: 'deleted_at'
//     }
//   },
//   {
//     modelName: 'Event',
//     timestamps: true,
//     sequelize: databaseConnection
//   }
// );

// Event.belongsToMany(Benefit, { through: EventBenefit });

// module.exports = Event;

// // const EventBenefit = require('./EventBenefit');
// //
// // module.exports = (sequelize, DataTypes) => {
// //   const Event = sequelize.define(
// //     'Event',
// //     {
// //       id: {
// //         allowNull: false,
// //         autoIncrement: true,
// //         primaryKey: true,
// //         type: DataTypes.INTEGER
// //       },
// //       title: {
// //         type: DataTypes.STRING,
// //         allowNull: false
// //       },
// //       description: {
// //         type: DataTypes.TEXT,
// //         allowNull: false
// //       },
// //       location: {
// //         type: DataTypes.STRING,
// //         allowNull: false
// //       },
// //       gmapsUrl: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //         field: 'gmaps_url'
// //       },
// //       notes: {
// //         type: DataTypes.TEXT,
// //         allowNull: false
// //       },
// //       playerPrice: {
// //         type: DataTypes.DECIMAL(15, 2).UNSIGNED,
// //         allowNull: false,
// //         field: 'player_price'
// //       },
// //       keeperPrice: {
// //         type: DataTypes.DECIMAL(15, 2).UNSIGNED,
// //         allowNull: false,
// //         field: 'keeper_price'
// //       },
// //       eventDate: {
// //         type: DataTypes.DATEONLY,
// //         allowNull: false,
// //         field: 'event_date'
// //       },
// //       startTime: {
// //         type: DataTypes.TIME,
// //         allowNull: false,
// //         field: 'start_time'
// //       },
// //       endTime: {
// //         type: DataTypes.TIME,
// //         allowNull: false,
// //         field: 'end_time'
// //       },
// //       createdAt: {
// //         allowNull: false,
// //         type: DataTypes.DATE,
// //         field: 'created_at'
// //       },
// //       updatedAt: {
// //         allowNull: false,
// //         type: DataTypes.DATE,
// //         field: 'updated_at'
// //       },
// //       deletedAt: {
// //         allowNull: true,
// //         type: DataTypes.DATE,
// //         field: 'deleted_at'
// //       }
// //     },
// //     {
// //       tableName: 'events'
// //     }
// //   );
// //   Event.associate = (models) => {
// //     Event.belongsToMany(models.Benefit, {
// //       through: EventBenefit,
// //       as: 'benefits',
// //       foreignKey: 'benefit_id'
// //     });
// //   };
// //   return Event;
// // };

class Event extends Model {
  static associate(models) {
    // define association here
    Event.belongsToMany(models.Benefit, {
      through: models.EventBenefit,
      // as: 'benefits',
      foreignKey: 'event_id'
    });
    // this.hasMany(models.EventBenefit);
  }
}
Event.init(
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
      allowNull: false,
      field: 'gmaps_url'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: false
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
    sequelize: databaseConnection,
    // define table name
    tableName: 'events',
    modelName: 'Event'
  }
);

module.exports = Event;
