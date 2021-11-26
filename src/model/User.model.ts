import { Optional, Sequelize, Model, DataTypes } from "sequelize";

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  date_of_birth: string;
  access_token: string;
  passwrord_reset_token: string;
  recovery_mail: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
  createdAt: Date;
  updatedAt: Date;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<UserInstance>("Users", {
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
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    access_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwrord_reset_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recovery_mail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
