require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose")
    ;
const req = require("express/lib/request");
const { constant } = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs")

app.use(express.static("public"));

app.use(session({
    secret: "ourLittleSecret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());

app.use(passport.session());

mongoose.connect("mongodb+srv://anurag4992:Anhourlat6@cluster0.j80jq.mongodb.net/userDB");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    title: Array,
    desc: Array
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

const arrTitle = ["Book 1", "Book 2"];
const arrDesc = ["This is content part of book 1", "This is content part of book 2"]; 3


app.get("/", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("index", { logged: "logout"});
        
    }
    else {
        res.render("index", { logged: "login"});
    }
});

app.get("/viewAll", function (req, res) {
    if (req.isAuthenticated()) {
        User.findById({ _id: req.user.id }, function (err, foundUser) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("viewAll", { arrTitle: foundUser.title, arrDesc: foundUser.desc});
            }
        });
    }
    else {
        res.render("login", { loginOrRegister: "login", signinOrSignup: "Sign in" })
    }
});

app.get("/viewById/:topic", function (req, res) {

    User.findById({ _id: req.user.id }, function (err, foundUser) {
        if (err) {
            console.log(err);
        }
        else {
            if (foundUser.title.indexOf(req.params.topic) != -1) {
                const a = 1;
                res.render("viewById", { a: a, foundTitle: req.params.topic, foundDesc: foundUser.desc[foundUser.title.indexOf(req.params.topic)] });
            }
            else {
                const a = 0;
                res.render("viewById", { a: a, foundTitle: "", foundDesc: "" });
            }
        }
    });

});

app.get("/edit/:id", function (req, res) {
    const id = req.params.id;
    console.log(id);
    User.findById({ _id: req.user.id }, function (err, foundUser) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("edit", { id: id, arrTitle: foundUser.title, arrDesc: foundUser.desc });
        }
    });

});

app.get("/register", function (req, res) {
    res.render("login", { loginOrRegister: "register", signinOrSignup: "Sign up" })
});

app.get("/login", function (req, res) {
    res.render("login", { loginOrRegister: "login", signinOrSignup: "Sign in" });
});

app.get("/newBook", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("newBook");
    }
    else {
        res.redirect("/login");
    }
});

app.get("/logout", function (req, res) {
    req.logOut();
    res.redirect("/");
});

app.post("/viewById", function (req, res) {
    const searched = req.body.title;
    if (req.isAuthenticated()) {
        res.redirect("/viewById/" + searched);
    }
    else {
        res.redirect("/login");
    }


});

app.post("/add", function (req, res) {

    User.findById({ _id: req.user.id }, function (err, foundUser) {
        if (err) {
            console.log(err);
        }
        else {
            foundUser.title.push(req.body.newTitle);
            foundUser.desc.push(req.body.newDesc);
            foundUser.save(err, function(){
                res.redirect("/viewAll");
            });
        }
    });
});

app.post("/edit", function (req, res) {
    const edited = req.body.name;
    res.redirect("/edit/" + edited);
});

app.post("/delete", function (req, res) {
    const deleted = req.body.delete;

    User.findById({_id: req.user.id}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else {
            foundUser.title.splice(deleted,1);
            foundUser.desc.splice(deleted,1);
            foundUser.save(err, function(){
                res.redirect("/viewAll");
            });
        }
    });
   
});

app.post("/viewAll", function (req, res) {
    const edited=req.body.updates;
    User.findById({_id: req.user.id}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else {
            foundUser.title.splice(edited,1,req.body.newTitle);
            foundUser.desc.splice(edited,1,req.body.newDesc);
            foundUser.save(err, function(){
                res.redirect("/viewAll");
            });
            
        }
    });
    
});

app.post("/register", function (req, res) {
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, function () {
                user.title = arrTitle;
                user.desc = arrDesc;
                user.save(err, function(){
                    res.redirect("/");
                });

                
            });
        }
    });
});

app.post("/login", function (req, res) {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.logIn(user, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/");
            });
        }
    });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
    console.log("Server has started");

});