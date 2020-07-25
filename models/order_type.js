const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    ordertype_id: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "ordertype_id"
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: "제품 구입 수단",
      field: "name"
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
    author: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: "추가한 사람",
      field: "author",
      references: {
        key: "member_id",
        model: "users_model"
      }
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "is_visible"
    }
  };
  const options = {
    timestamps: false,
    tableName: "order_type",
    comment: "",
    indexes: [{
      name: "author",
      unique: false,
      type: "BTREE",
      fields: ["author"]
    }]
  };
  const OrderTypeModel = sequelize.define("order_type_model", attributes, options);
  return OrderTypeModel;
};