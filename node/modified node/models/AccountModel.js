const mongoose = require('mongoose')
const Schema = mongoose.Schema

let accountSchema = new Schema({
    firstname: {
        type: String
    },
    
    lastname: {
        type: String
    },

    imgLink: {
        type: String
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    address: {
        type: String
    },
    description: {
        type: String
    }
}, {
    collection: "users"
});

module.exports = mongoose.model('Account', accountSchema);
