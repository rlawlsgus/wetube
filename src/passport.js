import passport from "passport";
import GithubStrategy from "passport-github";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./models/User";
import {
  githubLoginCallback,
  googleLoginCallback
} from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy());

let callback;

if (process.env.PRODUCTION) {
  callback = "https://sleepy-spire-74706.herokuapp.com";
} else {
  callback = "http://localhost:4000";
}

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: `${callback}${routes.githubCallback}`
    },
    githubLoginCallback
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GG_ID,
      clientSecret: process.env.GG_SECRET,
      callbackURL: `${callback}${routes.googleCallback}`
    },
    googleLoginCallback
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
