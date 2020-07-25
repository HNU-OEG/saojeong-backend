const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    store_id: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "store_id"
    },
    store_indexholder: {
      type: DataTypes.INTEGER(3),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "store_indexholder"
    },
    store_name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "store_name"
    },
    store_type: {
      type: DataTypes.STRING(6),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "store_type"
    },
    store_master: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "store_master",
      references: {
        key: "member_id",
        model: "users_model"
      }
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
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "is_visible"
    },
    version: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: "1",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "version"
    }
  };
  const options = {
    timestamps: false,
    tableName: "store_information",
    comment: "",
    indexes: [{
      name: "store_master",
      unique: false,
      type: "BTREE",
      fields: ["store_master"]
    }]
  };
  const StoreInformationModel = sequelize.define("store_information_model", attributes, options);
  return StoreInformationModel;
};