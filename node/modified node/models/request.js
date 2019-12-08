const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    contact: String,
    details: String,
});

module.exports = mongoose.model("Request", RequestSchema);