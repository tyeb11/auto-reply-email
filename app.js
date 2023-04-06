import chalk from "chalk";
import express from "express";

const app = express();

app.listen(process.env.PORT, () => {
  console.log(chalk.green(`server listening on port ${process.env.PORT}...`));
});
