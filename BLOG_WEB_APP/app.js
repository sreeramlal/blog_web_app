var express = require('express');
var app=express();
var blog=require('./blog.js')
app.use('/',blog)
app.use(express.static('public'))



app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(5000,() =>
    console.log('server id started in port no 3000')
);