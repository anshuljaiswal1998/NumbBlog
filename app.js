var express = require('express');
var app = express();
const compression = require('compression');
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');

mongoose.Promise = global.Promise;

app.use(express.static(__dirname + '/client/dist/'));

mongoose.connect(config.uri,(err)=>{
  if(err) {
    console.log("Could not connect to Db" + err); 
  }else{
    console.log("Connected to "+config.db);
  }
});


app.get('/*', (req, res)=>{
  res.sendFile(path.join(__dirname+'/client/dist/client/index.html'));
});

app.listen(8000,()=>{
    console.log("Port is working Fine");
});