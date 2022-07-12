const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth_routes');
const multer = require('multer');
const fs = require('fs');

// db objects
const Post = require('./model/Post');

app.set('view engine', 'ejs');

app.use(express.static('uploads'));
app.use(express.static('static_files'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(8000);

dbURI = 'mongodb+srv://tom123:Graphic4@mynewcluster.coxgo.mongodb.net/oscar_database?retryWrites=true&w=majority';
mongoose.connect(dbURI)
    .then((result) => {

    })
    .catch((err) => console.log(err));

// Routes

app.get('/', (req, res) => {
    res.render('index.ejs', { title: 'Home' });
});

app.get('/about', (req, res) => {
    res.render('about.ejs');
});

app.get('/buy', (req, res) => {
    Post.find()
        .then((result) => {
            res.render('buy.ejs', { title: 'Buy', posts: result });
        })
        .catch((err) => console.log(err));
});

app.get('/sell', (req, res) => {
    res.render('sell.ejs');
});

// upload images
let storage = multer.diskStorage({ 
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, file.fieldname + '_' + Date.now() + file.originalname)
});

let upload = multer({
    storage: storage
}).single('image');

// save and post your product
app.post('/sell', upload, (req, res) => {
    const post = new Post({
        productName: req.body.productName,
        price: req.body.price,
        description: req.body.description,
        cellNumber: req.body.cellNumber,
        otherDetails: req.body.otherDetails,
        image: req.file.filename
    });

    post.save()
        .then((result) => {
            res.redirect('/buy');
        })
        .catch((err) => console.log(err));
});

app.get('/buy/details/:id', (req, res) => {
    const prod_id = req.params.id;

    Post.findById(prod_id)
        .then((result) => {
            res.render('details.ejs', { result });
        })
        .catch((err) => console.log(err));
});

// Delete user routes
app.get('/delete/:id', (req, res) => {
    const prod_id = req.params.id;

    Post.findByIdAndRemove(prod_id, (err, result) => {
        if (result.image != '') {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch(err) {
                console.log(err);
            }
        } 
        res.redirect('/');
    });
});

app.use(authRoutes);
app.use((req, res) => {
    res.status(404).render('404.ejs');
});