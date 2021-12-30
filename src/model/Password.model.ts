import { Optional, Sequelize, Model, DataTypes } from "sequelize";

interface PasswordAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  website: string;
  owner_id: Number;
}

interface PasswordCreationAttributes
  extends Optional<PasswordAttributes, "id"> {}

interface PasswordInstance
  extends Model<PasswordAttributes, PasswordCreationAttributes>,
    PasswordAttributes {
  createdAt: Date;
  updatedAt: Date;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<PasswordInstance>("passwords", {
    id: {
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      type: DataTypes.INTEGER,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
