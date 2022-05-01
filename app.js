const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
var db;

const PORT = process.env.PORT || 3000;


// set the view engine to ejs
app.set('view engine', 'ejs');

// Database
// if run on container, use the name of the database container instead of localhost
MongoClient.connect('mongodb://root:password@mongo_db:27017', function(err, client) {
    if (err) {
        console.error(err);
    }

    db = client.db('todo');
    console.log('Connected to MongoDB todo');
    // var collection = db.collection('items');
    // collection.find().toArray(function(err, docs) {
    //     console.log(docs);
    // });
});


app.use(bodyParser.urlencoded({ extended: true }));
// make db accessible to all routers
app.use(function(req, res, next) {
	req.db = db;
	next();
});



app.get('/', (req, res) => {
    var db=req.db;
    var collection = db.collection('items');
    collection.find().toArray(function(err, docs) {
     res.render('pages/index',{notes: docs});
    });
   
});

// add new note
app.post('/notes', (req, res) => {
    console.log(req.body);
    db.collection('items').insertOne(req.body, (err, result) => {
        if (err) {
            res.send({ 'error': 'An error has occurred' });
        } else {
            res.redirect('/');
        }
    });
  })

//   delete note
app.get('/notes/delete/:id', (req, res) => {
    var db=req.db;
    var collection = db.collection('items');
    var noteToDelete = req.params.id;
    collection.deleteOne({'_id': ObjectId(noteToDelete)}, (err, result) => {
        if (err) {
            console.log(err)
            res.send({ 'error': 'An error has occurred ${err}' });
        } else {
            res.redirect('/');   
        }
    });
});

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
  });
  

app.listen(PORT, () => {   
    console.log(`Server is running on port ${PORT}`);
});

