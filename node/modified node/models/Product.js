const mongoose = require('mongoose');

const ProdSchema = new mongoose.Schema({
    image: String,
    prodName: String,
    prodDesc: String
});

module.exports = mongoose.model("Product", ProdSchema);
