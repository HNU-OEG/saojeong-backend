const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    document_id: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "document_id"
    },
    board_category: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "board_category",
      references: {
        key: "document_id",
        model: "board_contents_model"
      }
    },
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
    title: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "title"
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "content"
    },
    readed_count: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "readed_count"
    },
    voted_count: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "voted_count"
    },
    blamed_count: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "blamed_count"
    },
    comment_count: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "comment_count"
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
    last_updated_id: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "last_updated_id",
      references: {
        key: "document_id",
        model: "board_contents_model"
      }
    },
    last_updated_ip: {
      type: varbinary(20),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "last_updated_ip"
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "updated_at"
    }
  };
  const options = {
    tableName: "board_contents",
    comment: "",
    indexes: [{
      name: "member_id",
      unique: false,
      type: "BTREE",
      fields: ["member_id"]
    }, {
      name: "last_updated_id",
      unique: false,
      type: "BTREE",
      fields: ["last_updated_id"]
    }, {
      name: "board_category",
      unique: false,
      type: "BTREE",
      fields: ["board_category"]
    }]
  };
  const BoardContentsModel = sequelize.define("board_contents_model", attributes, options);
  return BoardContentsModel;
};