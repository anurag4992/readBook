const mongoose = require("mongoose");
const {itemSchema}=require("./item.js")

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    title: Array,
    desc: Array,
    file: [itemSchema]
});

module.exports={
    userSchema: userSchema,
    User: new mongoose.model("User", userSchema)
}
