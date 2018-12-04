var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var log4 = require('./logger/log4');
// var outPutLog = require('./util/logger/outPutLog');
// require('./util/email/sendDayLog')();
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
log4.appLogger(app);

app.use('/ask/zhugeasklogs',express.static(path.join(__dirname, '../zhugelogs')));
app.use('/home',function (req,res,next){
    res.render('index',{
        title: 'aha'
    });
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // output error logs 
    // outPutLog.appJsError(err,req);
    // set locals, only providing error in development
    res.statusCode = 404;
    res.render('error',{
        content: err
    });
});

app.listen(3000,function (){
    console.log(`server is running at: 
    \n =============================== 
    \n ^_^ daiyunzhou ^_^
    \n http://127.0.0.1:3000 
    \n ===============================`);
});
