const express = require('express');
const router = express();
const path = require('path');
const passport = require('passport');
const passportConfig = require('../handler/passport');
const authController= require('../controller/authController');
const users = require("../model/security/User");

passportConfig(passport, users);

router.get('/login(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.route("/signin")
    .post(passport.authenticate('local-login', {
        failureRedirect: "/auth/login"
    }), (req, res) => {
        res.redirect("/");
    });

router.route("/signout")
.post(authController.logout);

module.exports = router;