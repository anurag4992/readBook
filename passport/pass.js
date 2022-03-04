const express=require("express");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const {User}= require("../models/user");
const {userSchema}=require("../models/user");

const app=express();

app.use(session({
    secret: "ourLittleSecret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());

app.use(passport.session());

userSchema.plugin(passportLocalMongoose);

passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

module.exports= app;
