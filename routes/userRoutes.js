const express=require("express");
const control=require("../controllers/control");

const app=express();

app.get("/", control.home);

app.get("/viewAll", control.viewAll);

app.get("/viewById/:topic", control.viewById);

app.get("/edit/:id", control.edit);

app.get("/register", control.register);

app.get("/login", control.login);

app.get("/newBook", control.newBook);

app.get("/logout", control.logout);

app.post("/viewById", control.viewByIdPost);

app.post("/add", control.add);

app.post("/edit", control.editPost);

app.post("/delete", control.delete);

app.post("/viewAll", control.viewAllPost);

app.post("/register", control.registerPost);

app.post("/login", control.loginPost);

module.exports= app;