const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    store_id: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "store_id",
      references: {
        key: "store_id",
        model: "store_information_model"
      }
    },
    member_id: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "member_id",
      references: {
        key: "member_id",
        model: "users_model"
      }
    },
    question1: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "question1"
    },
    question2: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "question2"
    },
    question3: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "question3"
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "is_available"
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp'),
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "created_at"
    },
    removed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "removed_at"
    }
  };
  const options = {
    tableName: "store_vote_grade",
    comment: "",
    indexes: [{
      name: "store_id",
      unique: false,
      type: "BTREE",
      fields: ["store_id"]
    }, {
      name: "member_id",
      unique: false,
      type: "BTREE",
      fields: ["member_id"]
    }]
  };
  const StoreVoteGradeModel = sequelize.define("store_vote_grade_model", attributes, options);
  return StoreVoteGradeModel;
};