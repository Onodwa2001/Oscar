const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth_routes');

// db objects
const Post = require('./model/Post');

app.set('view engine', 'ejs');

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

// Other handlers
app.post('/sell', (req, res) => {
    const post = new Post(req.body);

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

app.use(authRoutes);
app.use((req, res) => {
    res.status(404).render('404.ejs');
});