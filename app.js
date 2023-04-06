import bodyParser from "body-parser";
import chalk from "chalk";
import cookieSession from "cookie-session";
import express from "express";
import passport from "passport";
import routes from "./routes/index.js";

import "./utils/passport.js";

const app = express();
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEYS],
  })
);
app.use(passport.initialize());
app.use(passport.session());

routes(app);

app.listen(process.env.PORT, () => {
  console.log(chalk.green(`server listening on port ${process.env.PORT}...`));
});
