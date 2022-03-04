require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const req = require("express/lib/request");
const { constant, indexOf } = require("lodash");
const multer = require("multer");

const {PORT}=require("./config/keys");
const {mongoURI}=require("./config/keys");
const userRoutes=require("./routes/userRoutes");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs")

app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));

mongoose.connect(mongoURI);

app.use("/", userRoutes);

app.listen(PORT, () => {
    console.log("Server has started");
});