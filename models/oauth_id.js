const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
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
    provider: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "provider"
    },
    oauth_version: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "oauth_version"
    },
    access_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "access_token"
    }
  };
  const options = {
    tableName: "oauth_id",
    comment: "",
    indexes: [{
      name: "member_id",
      unique: false,
      type: "BTREE",
      fields: ["member_id"]
    }]
  };
  const OauthIdModel = sequelize.define("oauth_id_model", attributes, options);
  return OauthIdModel;
};