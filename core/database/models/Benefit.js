// const { Model, DataTypes } = require('sequelize');
const { Model, DataTypes } = require('sequelize');
const databaseConnection = require('../config/databaseConnection');
// // const Event = require('./event');
// // const EventBenefit = require('./EventBenefit');

// class Benefit extends Model {}

// Benefit.init(
//   {
//     id: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     imageUrl: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       field: 'image_url'
//     },
//     imagePublicId: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       field: 'image_public_id'
//     },
//     createdAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       field: 'created_at'
//     },
//     updatedAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       field: 'updated_at'
//     },
//     deletedAt: {
//       type: DataTypes.DATE,
//       allowNull: true,
//       field: 'deleted_at'
//     }
//   },
//   {
//     tableName: 'benefits',
//     timestamps: true,
//     sequelize: databaseConnection
//   }
// );

// // Benefit.belongsToMany(Event, { through: EventBenefit });

// module.exports = Benefit;

// // module.exports = (sequelize, DataTypes) => {
// //   const Benefit = sequelize.define(
// //     'Benefit',
// //     {
// //       id: {
// //         allowNull: false,
// //         autoIncrement: true,
// //         primaryKey: true,
// //         type: DataTypes.INTEGER
// //       },
// //       name: {
// //         type: DataTypes.STRING,
// //         allowNull: false
// //       },
// //       imageUrl: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //         field: 'image_url'
// //       },
// //       imagePublicId: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //         field: 'image_public_id'
// //       },
// //       createdAt: {
// //         type: DataTypes.DATE,
// //         allowNull: false,
// //         field: 'created_at'
// //       },
// //       updatedAt: {
// //         type: DataTypes.DATE,
// //         allowNull: false,
// //         field: 'updated_at'
// //       },
// //       deletedAt: {
// //         type: DataTypes.DATE,
// //         allowNull: true,
// //         field: 'deleted_at'
// //       }
// //     },
// //     {
// //       tableName: 'benefits'
// //     }
// //   );
// //   Benefit.associate = (models) => {
// //     Benefit.belongsToMany(models.Event, {
// //       through: 'EventBenefit',
// //       as: 'events',
// //       foreignKey: 'event_id'
// //     });
// //   };
// //   return Benefit;
// // };

class Benefit extends Model {
  static associate(models) {
    // define association here
    Benefit.belongsToMany(models.Event, {
      through: models.EventBenefit,
      // as: 'events',
      foreignKey: 'benefit_id'
    });
    // this.hasMany(models.EventBenefit);
  }
}
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
    sequelize: databaseConnection,
    // define table name
    tableName: 'benefits',
    modelName: 'Benefit'
  }
);

module.exports = Benefit;
