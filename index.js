// express
const express = require('express');
const app = express();

// post data body
app.use(express.urlencoded({ extended: true }));

// static resources
app.use(express.static('./public'));

// index.html page
app.get('/', function getState(req,res) {
  res.setHeader('Content-Type', 'text/html');
  res.send(`index.html`);
})

// src
const router = require('./src/router');
app.use('/api', router);

// listen port
let port = 9999;
app.listen(port,()=>{
  console.log("Server is running on: http://localhost:" + port);
})