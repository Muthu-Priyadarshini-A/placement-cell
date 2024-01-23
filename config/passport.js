const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;

// authentication using passport
passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async function (req, email, password, done) {
        try {
          // find the user and establish the identity
          const user = await User.findOne({ email });
  
          if (!user) {
            console.log("Invalid UserName or Password");
            return done(null, false);
          }
  
          // match the Password
          const isPasswordValid = await user.isValidatePassword(password);
  
          if (!isPasswordValid) {
            console.log("Invalid Username or Password");
            return done(null, false);
          }
  
          return done(null, user);
        } catch (err) {
          console.log("Error in finding the user", err);
          return done(err);
        }
      }
    )
  );

// serializing the user to choose which key should be kept in cookies
passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
  
      if (!user) {
        console.log("User not found during deserialization");
        return done(null, false);
      }
  
      return done(null, user);
    } catch (err) {
      console.log("Error in finding user during deserialization", err);
      return done(err);
    }
  });

// check if user authenticated
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function
  if (req.isAuthenticated()) {
    return next();
  }

  // redirecting the user
  return res.redirect("/");
};

passport.setAuthenticatedUser = function (req, res, next) {
  // if user is authenticated that store the user in req
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;