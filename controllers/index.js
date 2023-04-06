import chalk from "chalk";

export async function getReplyToCurrentEmails(req, res) {
  try {
  } catch (e) {
    console.log(chalk.red(`error : ${e}`));
    res.send(e);
  }
}
