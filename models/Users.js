const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    member_id: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "member_id"
    },
    username: {
      type: DataTypes.STRING(40),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "username"
    },
    nickname: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "nickname"
    },
    password: {
      type: DataTypes.STRING(140),
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "password"
    },
    gender: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: "",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "gender"
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "enabled"
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "email",
      unique: "email"
    },
    // created_at: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    //   defaultValue: sequelize.fn('current_timestamp'),
    //   primaryKey: false,
    //   autoIncrement: false,
    //   comment: null,
    //   field: "created_at"
    // },
    withdraw_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "withdraw_at"
    },
    last_updated_id: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "last_updated_id",
      references: {
        key: "member_id",
        model: "users_model"
      }
    },
    last_updated_ip: {
      type: 'varbinary(20)',
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "last_updated_ip"
    },
    // updated_at: {
    //   type: DataTypes.DATE,
    //   allowNull: true,
    //   defaultValue: null,
    //   primaryKey: false,
    //   autoIncrement: false,
    //   comment: null,
    //   field: "updated_at"
    // },
    type: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "type"
    }
  };
  const options = {
    tableName: "users",
    comment: "",
    indexes: [{
      name: "last_updated_id",
      unique: false,
      type: "BTREE",
      fields: ["last_updated_id"]
    }]
  };
  const UsersModel = sequelize.define("users_model", attributes, options);
  return UsersModel;
};