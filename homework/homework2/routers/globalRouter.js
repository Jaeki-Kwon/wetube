import express from "express";
import routes from "./routes";
import { home, join, login, confirm_account } from "../controllers/controller";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.join, join);
globalRouter.get(routes.login, login);
globalRouter.get(routes.confirm_account, confirm_account);

export default globalRouter;
