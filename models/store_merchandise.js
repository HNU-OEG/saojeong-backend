const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    merchandise_id: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "merchandise_id"
    },
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
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: "상품 이름",
      field: "name"
    },
    price: {
      type: DataTypes.INTEGER(8),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: "상품 가격",
      field: "price"
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
    is_visible: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "is_visible"
    },
    removed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "removed_at"
    },
    last_updated_ip: {
      type: 'varbinary(20)',
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "last_updated_ip"
    }
  };
  const options = {
    timestamps: false,
    tableName: "store_merchandise",
    comment: "",
    indexes: [{
      name: "store_id",
      unique: false,
      type: "BTREE",
      fields: ["store_id"]
    }]
  };
  const StoreMerchandiseModel = sequelize.define("store_merchandise_model", attributes, options);
  return StoreMerchandiseModel;
};