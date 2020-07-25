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
    session_key: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "session_key"
    },
    expired: {
      type: DataTypes.STRING(14),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "expired"
    },
    session_value: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "session_value"
    },
    session_ip: {
      type: varbinary(20),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "session_ip"
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp'),
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "updated_at"
    }
  };
  const options = {
    tableName: "sessions",
    comment: "",
    indexes: [{
      name: "member_id",
      unique: false,
      type: "BTREE",
      fields: ["member_id"]
    }]
  };
  const SessionsModel = sequelize.define("sessions_model", attributes, options);
  return SessionsModel;
};