import express, { Application } from "express";
import db from "./model";
import Routes from "./route";
import cors from "cors";
import helmet from "helmet";
import { jwtMiddleware } from "./middleware";
const app: Application = express();
const port = process.env.PORT || 3000;
db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and Resync Db");
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(jwtMiddleware);
Routes(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
