var express = require('express');
const router = express.Router();
const cors = require('cors');

var app = express();
const compression = require('compression');
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const bodyParser = require('body-parser');
// var validator = require('express-validator');

mongoose.Promise = global.Promise;

mongoose.connect(config.uri,{useNewUrlParser: true},(err)=>{
  if(err) {
    console.log("Could not connect to Db" + err);
  }else{
    console.log("Connected to "+config.db);
  }
});

app.use(cors({ origin: 'http://localhost:4200' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static(__dirname + '/client/dist/'));
app.use('/auth',authentication);

// app.use(validator());




app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname+'/client/dist/client/index.html'));
});

app.listen(8000,()=>{
    console.log("Port is working Fine");
});
