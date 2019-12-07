const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    productName: String,
    prodimage: String,
    prodcat: String,
    productDesc: String
});

module.exports = mongoose.model("Item", ItemSchema);