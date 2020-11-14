// 서버 만들기!!
/* const express = require("express");
require : node module을 어딘가에서 가져오기 */

// 최신버전 JS
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localMiddleware } from "./middlewares";
import routes from "./routes";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/viedoRouter";
import globalRouter from "./routers/globalRouter";
import apiRouter from "./routers/apiRouter";

import "./passport";

const app = express();

const CokieStore = MongoStore(session);
/*
const PORT = 4000;

const handleListening = () =>
  console.log(`Listening on : http://localhost:${PORT}`);
*/
/*
const handleHome = (req, res) => res.send("Hello from home!! Fuck");

const handleProfile = (req, res) => res.send("You are on my profile");
*/

// middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   })
// );
app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CokieStore({ mongooseConnection: mongoose.connection })
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(localMiddleware);


// pug

/* 연결을 끊을 수 있음
const middleware = (req, res, next) => {
  res.send("not happening");
}; */

/*
app.get("/", handleHome);

app.get("/profile", handleProfile);
*/

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter); // 누군가 /user 경로로 접속하면 이 router 전체를 사용
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);
// app.listen(PORT, handleListening);

export default app; // 누군가 내 파일을 불러올 때(import) app object 주겠다
