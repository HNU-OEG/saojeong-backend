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
    document_id: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "document_id",
      references: {
        key: "document_id",
        model: "board_contents_model"
      }
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp'),
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "read_at"
    }
  };
  const options = {
    tableName: "board_read_log",
    comment: "",
    indexes: [{
      name: "member_id",
      unique: false,
      type: "BTREE",
      fields: ["member_id"]
    }, {
      name: "document_id",
      unique: false,
      type: "BTREE",
      fields: ["document_id"]
    }]
  };
  const BoardReadLogModel = sequelize.define("board_read_log_model", attributes, options);
  return BoardReadLogModel;
};