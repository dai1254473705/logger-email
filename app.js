var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var app = express();

var loggerConfig = require('./config');
// 设置日志配置项
loggerConfig.setLogConfig({
    compress: true, //是否在生成第二个文件时将上一个压缩 如：error_2018-10-30.log.gz
    logPath: path.join(__dirname,'./defaultlogs/'),
    daysToKeep: 7,//保存7天,log4不起作用，单独方法删除文件
    attachments: true,// true 为发送附件，默认false
    onLineLink: 'http://127.0.1:3000/defaultlogs/' // send:link<required> 可访问的域名地址，查看日志用
});
// 要保证链接能访问到日志
app.use('/defaultlogs',express.static(path.join(__dirname, '../defaultlogs')));

// 设置邮件配置项（如果需要发送邮件）
loggerConfig.setEmailConfig({
    host: 'smtp.exmail.qq.com',
    port: 465,
    secure: true,// true for 465, false for other ports
    user: 'user email', // generated ethereal user
    pass: 'user email password', // generated ethereal password 
    from: 'sender address', // sender address
    to: 'receiver address', // list of receivers 多个邮箱","分开
    canSend: true,//是否可以发送邮件（false：不发送；true:发送）
    subject: '测试邮件啊啊',
});
var logger = require('./index');
logger.sendDayLog();// 每日定时发送邮件
logger.appLogger(app); // 控制台输出日志

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
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
    logger.template.appJsError(err,req);
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
