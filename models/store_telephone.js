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
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "telephone"
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "is_visible"
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
    order: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      defaultValue: "100",
      primaryKey: false,
      autoIncrement: false,
      comment: "primary, secondary ... ",
      field: "order"
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "is_verified"
    }
  };
  const options = {
    tableName: "store_telephone",
    comment: "",
    indexes: [{
      name: "store_id",
      unique: false,
      type: "BTREE",
      fields: ["store_id"]
    }]
  };
  const StoreTelephoneModel = sequelize.define("store_telephone_model", attributes, options);
  return StoreTelephoneModel;
};