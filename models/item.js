const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    item: Array
});

module.exports={
    itemSchema: itemSchema,
    Item: new mongoose.model("Item", itemSchema)
}
