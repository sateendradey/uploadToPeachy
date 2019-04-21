// call all the required packages
const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
const port = process.env.PORT || 5000;
const path = require('path');
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = "mongodb+srv://jacob:jacob@cluster0-qwsrk.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "PeachyKeen";
const USER_COLLECTION = "User";
const RESTAURANT_COLLECTION = "Restaurant";
var db;

fs = require('fs-extra')
const client = new MongoClient(CONNECTION_URL, { useNewUrlParser: true });
//CREATE EXPRESS APP
const app = express();
app.use(bodyParser.urlencoded({extended: true}))

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })


//ROUTES WILL GO HERE
app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/uploadPhotos', upload.array('myFiles', 12), (req, res, next) => {
  var dbo = db.db(DATABASE_NAME);
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
  var searchTerm = { id: parseInt(req.body.myID) };
  files.map((file) => {
    var img = fs.readFileSync(file.path);
    var encode_image = img.toString('base64');
    var finalImg = {
      contentType: file.mimetype,
      image:  new Buffer(encode_image, 'base64')
    };
    dbo.collection(RESTAURANT_COLLECTION).updateOne(searchTerm, {$addToSet: {Images: finalImg}}, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
    })
  });
  res.redirect('/')
})
MongoClient.connect(CONNECTION_URL, function (err, database) {
  if (err)
  throw err
  else
  {
    db = database;
    console.log('Connected to MongoDB');
    //Start app only after connection is ready
    app.listen(port, () => console.log(`App listening on port ${port}!`))
  }
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
