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
    weekday: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "weekday"
    },
    start_hour: {
      type: DataTypes.TIME,
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "start_hour"
    },
    end_hour: {
      type: DataTypes.TIME,
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "end_hour"
    }
  };
  const options = {
    tableName: "store_opening_hours",
    comment: "",
    indexes: [{
      name: "store_id",
      unique: false,
      type: "BTREE",
      fields: ["store_id"]
    }]
  };
  const StoreOpeningHoursModel = sequelize.define("store_opening_hours_model", attributes, options);
  return StoreOpeningHoursModel;
};