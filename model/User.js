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

// static method to log in users
UserSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const Users = mongoose.model('user', UserSchema);
module.exports = Users;