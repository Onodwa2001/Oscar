const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cellNumber: {
        type: Number
    },
    otherDetails: {
        type: String
    },
    image: {
        type: String,
        required: true
    }
}, { timestamps: true });

let Post = mongoose.model('post', postSchema);
module.exports = Post;