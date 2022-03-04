const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    item: Array
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    title: Array,
    desc: Array,
    file: [itemSchema]
});

module.exports={
    userSchema: userSchema,
    Item: new mongoose.model("Item", itemSchema),
    User: new mongoose.model("User", userSchema)
}