/*
asteroid/server.js
*/

const express = require('express'); //import express
const app = express(); //initialize express

app.use(express.static(__dirname + '/client/'));

app.get('/asteroid', function(req,res){
    res.sendFile(__dirname+'/client/drive.html')
})

//Create app listening on port 3000
app.listen(3000,function() {
    console.log('asteroid listening on port 3000...');
})