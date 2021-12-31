import { time } from "console";
import { Optional, Sequelize, Model, DataTypes } from "sequelize";

interface LoginDetailAttributes {
  id: number;
  email: string;
  user_id: number;
  ip: string;
  logged_at: Date;
  access_token: string;
}

interface LoginDetailCreationAttributes
  extends Optional<LoginDetailAttributes, "id"> {}

interface LoginDetailInstance
  extends Model<LoginDetailAttributes, LoginDetailCreationAttributes>,
    LoginDetailAttributes {}

export default (sequelize: Sequelize) => {
  return sequelize.define<LoginDetailInstance>("loginDetails", {
    id: {
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logged_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    access_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
