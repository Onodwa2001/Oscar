// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 6
//     }
// }, { timestamps: true });

// const User = mongoose.model('user', userSchema);
// module.exports = User;

const mongoose = require('mongoose');
const { isEmail } = require('validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const min = 6;

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: [true, 'user already exists'],
        lowercase: true,
        validate: [ isEmail, 'Please enter valid email' ]
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [min, `Must enter at least ${min} characters`]
    }
}, { timestamps: true });

UserSchema.post('save', function(doc, next) {
    console.log('New user created', doc);
    next();
});

UserSchema.pre('save', async function(next) {
    console.log('User about to be saved', this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Users = mongoose.model('user', UserSchema);
module.exports = Users;