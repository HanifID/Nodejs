// config/passport.js

const bcrypt = require("bcrypt");

// load all the things we need
var LocalStrategy = require("passport-local").Strategy;

// expose this function to our app using module.exports
module.exports = function (passport, user) {

    var users = user;
    // //used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.username);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {

        users.findByPk(id).then(function ( user) {
            done(null, user);
        }
        );
    });

    passport.use(
        "local-login",
        new LocalStrategy(
            {
                // by default, local strategy uses username and password
                usernameField: "username",
                passwordField: "password",
                passReqToCallback: true, // allows us to pass back the entire request to the callback
            },
            function (req, username, password, done) {

                var isValidPassword = function (userpass, password) {
                    return bcrypt.compareSync(password, userpass);
                }

                users.findOne({
                    where: {
                        username: username
                    }
                }).then(function (user) {
                    if (!user) {
                        return done(null, false, req.flash("loginMessage", "No user found.")); // req.flash is the way to set flashdata using connect-flash
                    }

                    // if the user is found but the password is wrong

                    if (!isValidPassword(user.password, password)) {
                        return done(
                            null,
                            false,
                            req.flash("loginMessage", "Oops! Wrong password.")
                        );
                    }

                    // all is well, return successful user
                    return done(null, user);
                }
                );
            }
        )
    );
};
