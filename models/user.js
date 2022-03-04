const mongoose = require("mongoose");
const {itemSchema}=require("./item.js")

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(session({
    secret: "ourLittleSecret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());

app.use(passport.session());

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    title: Array,
    desc: Array,
    file: [itemSchema]
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

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

module.exports={
    userSchema: userSchema,
    User: new mongoose.model("User", userSchema)
}