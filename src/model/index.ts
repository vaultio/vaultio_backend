import {
  DATABASE_NAME,
  HOSTNAME,
  PASSWORD,
  DIALECT,
  USERNAME,
} from "../config";
import { Sequelize, Dialect } from "sequelize";
import UserModel from "./User.model";
import PasswordModel from "./Password.model";
import LoginDetailModel from "./LoginDetail.model";

const sequelize = new Sequelize(DATABASE_NAME, USERNAME, PASSWORD, {
  host: HOSTNAME,
  dialect: DIALECT as Dialect,
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

const User = UserModel(sequelize);
const Password = PasswordModel(sequelize);
const LoginDetail = LoginDetailModel(sequelize);

const db = { sequelize, User, Password, LoginDetail };

db.Password.belongsTo(db.User, { foreignKey: "owner_id" });

export default db;

export { User, Password, LoginDetail };
