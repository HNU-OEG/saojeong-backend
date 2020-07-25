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
    ordertype_id: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "ordertype_id",
      references: {
        key: "ordertype_id",
        model: "order_type_model"
      }
    }
  };
  const options = {
    tableName: "store_to_ordertype",
    comment: "",
    indexes: [{
      name: "store_id",
      unique: false,
      type: "BTREE",
      fields: ["store_id"]
    }, {
      name: "ordertype_id",
      unique: false,
      type: "BTREE",
      fields: ["ordertype_id"]
    }]
  };
  const StoreToOrdertypeModel = sequelize.define("store_to_ordertype_model", attributes, options);
  return StoreToOrdertypeModel;
};