const {User}= require("../models/user");
const {upload}= require("../multer/upload");

let fileItem = new Array();

module.exports= {
    home : (req, res) => {
        if (req.isAuthenticated()) {
            res.render("index", { logged: "logout" });
    
        }
        else {
            res.render("index", { logged: "login" });
        }
    },
    viewAll : (req, res) => {
        if (req.isAuthenticated()) {
            User.findById({ _id: req.user.id }, function (err, foundUser) {
                if (err) {
                    console.log(err);
                }
                else {
                    for (let i = 0; i < foundUser.file.length; i++) {
                        const element = foundUser.file[i];
                        const e = new Array();
                        for (let j = 0; j < element.item.length; j++) {
                            e.push(element.item[j]);
                        }
                        fileItem.push(e);
                    }
                    console.log(fileItem);
                    res.render("viewAll", { arrTitle: foundUser.title, arrDesc: foundUser.desc, arrFile: fileItem });
                    fileItem = new Array();
                }
            });
        }
        else {
            res.render("login", { loginOrRegister: "login", signinOrSignup: "Sign in" })
        }
    },
    viewById : (req, res) => {

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
    
    },
    edit : (req, res) => {
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
    
    },
    register : (req, res) => {
        res.render("login", { loginOrRegister: "register", signinOrSignup: "Sign up" })
    },
    login : (req, res) => {
        res.render("login", { loginOrRegister: "login", signinOrSignup: "Sign in" });
    },
    newBook : (req, res) => {
        if (req.isAuthenticated()) {
            res.render("newBook");
        }
        else {
            res.redirect("/login");
        }
    },
    logout : (req, res) => {
        req.logOut();
        res.redirect("/");
    },
    viewByIdPost : (req, res) => {
        const searched = req.body.title;
        if (req.isAuthenticated()) {
            res.redirect("/viewById/" + searched);
        }
        else {
            res.redirect("/login");
        }
    
    
    },
    add : (upload.array('avatar', 12), (req, res) => {

        User.findById({ _id: req.user.id }, function (err, foundUser) {
            if (err) {
                console.log(err);
            }
            else {
                foundUser.title.push(req.body.newTitle);
                foundUser.desc.push(req.body.newDesc);
                const newItem = new Item({
                    item: []
                });
                req.files.forEach(element => {
                    newItem.item.push("https://stark-castle-43434.herokuapp.com/uploads/" + element.filename);
                });
                foundUser.file.push(newItem);
                foundUser.save(err, function () {
                    res.redirect("/viewAll");
                });
            }
            // "localhost:3000/uploads/"+req.files[1].filename
        });
    }),
    editPost : (req, res) => {
        const edited = req.body.name;
        res.redirect("/edit/" + edited);
    },
    delete : (req, res) => {
        const deleted = req.body.delete;
    
        User.findById({ _id: req.user.id }, function (err, foundUser) {
            if (err) {
                console.log(err);
            }
            else {
                foundUser.title.splice(deleted, 1);
                foundUser.desc.splice(deleted, 1);
                foundUser.file.splice(deleted, 1)
                foundUser.save(err, function () {
                    res.redirect("/viewAll");
                });
            }
        });
    
    },
    viewAllPost : (req, res) => {
        const edited = req.body.updates;
        User.findById({ _id: req.user.id }, function (err, foundUser) {
            if (err) {
                console.log(err);
            }
            else {
                foundUser.title.splice(edited, 1, req.body.newTitle);
                foundUser.desc.splice(edited, 1, req.body.newDesc);
                foundUser.save(err, function () {
                    res.redirect("/viewAll");
                });
    
            }
        });
    
    },
    registerPost : (req, res) => {
        User.register({ username: req.body.username }, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("/register");
            }
            else {
                passport.authenticate("local")(req, res, function () {
                    user.save(err, function () {
                        res.redirect("/");
                    });
    
    
                });
            }
        });
    },
    loginPost : (req, res) => {

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
    
    }
}