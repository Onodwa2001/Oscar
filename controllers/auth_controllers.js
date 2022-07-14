const User = require('../model/User');
const jwt = require('jsonwebtoken');

let handleError = (err) => {
    // console.log(err.message, err.code);

    const errors = { email: '', password: '' };

    if (err.code === 11000) {
        errors['email'] = 'This email already exists';
        return errors;
    }

    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(errorObject => {
            errors[errorObject.path] = errorObject.properties.message;
        });
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;

let createToken = (id) => {
    return jwt.sign({ id }, 'akame ga kill has theee worst ending but coding is great... Sometimes', {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) => {
    res.render('signup.ejs');
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (err) {
        let error = handleError(err);
        res.status(400).send({ error });
    }
}

module.exports.login_get = (req, res) => {
    res.render('login.ejs');
}

module.exports.login_post = (req, res) => {
    console.log(req.body);
}
