import express from "express";
import routes from "./routes";
import globalRouter from "./routers/globalRouter";
const app = express();

app.use(routes.home, globalRouter);

// Codesanbox does not need PORT :)
app.listen(() => console.log(`Listening!`));
