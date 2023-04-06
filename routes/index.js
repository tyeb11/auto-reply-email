import checkUser from "../middlewares/checkUser.js";
import passport from "passport";
import { getReplyToCurrentEmails } from "../controllers/index.js";
export default (app) => {
  app.get("/", (req, res) =>
    res.send(`<h1>Welcome to auto reply email service</h1>`)
  );
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    function (req, res) {
      res.redirect("/api/mail/user/reply-current-email");
    }
  );
  app.get(
    "/api/mail/user/reply-current-email",
    checkUser,
    getReplyToCurrentEmails
  );
};
