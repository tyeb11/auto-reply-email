import chalk from "chalk";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

passport.serializeUser((user, done) => {
  console.log(chalk.blue("\n--------- Serialized User:"));
  console.log(chalk.blue(`user : ${user}`));

  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log(chalk.blue("\n--------- Deserialized User:"));
  console.log(chalk.blue(`user : ${user}`));

  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL,
      proxy: true,
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);
