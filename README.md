# logger-email
-------------------------------------

## 基于node+log4js+express+nodemailer+node-schedule 的日志系统

### install

> `npm i logger-email --save` or `cnpm i logger-eamil --save`

### modules

+ [log4js](https://log4js-node.github.io/log4js-node/) 
+ [moment](http://momentjs.com/)
+ [node-schedule](https://github.com/node-schedule/node-schedule)
+ [nodemailer](https://github.com/nodemailer/nodemailer)

### use

#### 1.在入口文件，app.js中使用

`app.js`:

> 1.需要先引入`logger-email/config`,配置log和email的参数；
> 2.配置完日志和邮箱的参数后，才可以`require('logger-email')`，否则配置不生效;

```sh
var loggerConfig = require('logger-email/config');
// 设置日志配置项
loggerConfig.setLogConfig({
    compress: true, //是否在生成第二个文件时将上一个压缩 如：error_2018-10-30.log.gz
    logPath: path.join(__dirname,'./defaultlogs/'),
    daysToKeep: 7,//保存7天,log4不起作用，单独方法删除文件
    attachments: true,// true 为发送附件，默认false
    onLineLink: 'http://127.0.1:3000/defaultlogs/' // send:link<required> 可访问的域名地址，查看日志用
});

// 设置邮件配置项（如果需要发送邮件）
loggerConfig.setEmailConfig({
    host: 'smtp.exmail.qq.com',
    port: 465,
    secure: true,// true for 465, false for other ports
    user: 'user email', // generated ethereal user
    pass: 'password', // generated ethereal password 
    from: 'sender email address', // sender address
    to: '**@163.com,**@qq.com', // list of receivers 多个邮箱","分开
    canSend: true,//是否可以发送邮件（false：不发送；true:发送）
    subject: 'test email subject'
});

// 要保证链接能访问到日志,这里的 `/defaultlogs` 路由要和 `loggerConfig.setLogConfig`中配置的`onLineLink`保持一直，否则邮件中的日志地址就不正确了
app.use('/defaultlogs',express.static(path.join(__dirname, '../defaultlogs')));

// 这句一定要在配置完`setLogConfig`和`setEmailConfig`后出现，否则配置会不生效,其他js需要引入时可以直接引入
var logger = require('logger-email');
```

#### 2. 捕获全局异常请求

> 3.在`app.js`中的全局catch error 方法里捕获异常；
```sh
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
```

#### 3. 捕获ejs报错，导致页面空白

```sh

var logger = require('logger-email');
var manualLog = logger.getLogger('manual'); // 手动输出

app.use('/home',function (req,res,next){
    res.render('index',{
        title: 'aha'
    },function (err,html){
        if (err){
            logger.template.ejsRenderError({
                page:'/home',
                req: req,
                error: err
            });
        }
        res.send(html);
    });
})
```

### 使用模板


> logger.template.appJsError(err,req); app.js中捕获异常用
> logger.template.emailLogger(object); 调用时会保存日志同时发送邮件到指定的邮箱
> logger.template.requestCatchError(object); 请求接口时try catch 到error时使用
> logger.template.requestError(object); 请求接口时状态异常使用
> logger.template.ejsRenderError(object); ejs 渲染参数出错，导致空白页面时用

###### 格式：

+ `appJsError`
```sh
/**
 * @param {Object} err 捕获到的错误信息
 * @param {Object} req request
 */
logger.template.appJsError(err,req);
```

+ `requestError` || `requestCatchError` || `requestError`
```sh
/**
 * @param {Number} durTime 接口耗时
 * @param {String} method：请求方法
 * @param {Object} req：request
 * @param {String} url: 接口地址或者页面地址
 * @param {Object} urlPara：请求参数
 * @param {Any} error：error信息
 * @param {Any} body：返回数据
 */
logger.template.requestError({
                    durTime: durTime, 
                    method: 'post',
                    req: request,
                    url: url,
                    urlPara: urlPara,
                    error: err,
                    body: body
                });
```

+ `ejsRenderError` 调用这个方法时会发送日志到指定邮箱
```sh
/**
 * @param {String} page 当前渲染ejs模板的模板路径
 * @param {Object} req：request
 * @param {Any} error：error信息
 */
logger.template.requestError({
                    page: '当前ejs模板地址',
					req: request,
					error: error信息
                });
```

### 输出日志对应关系
> level : [trace,debug,info,warn,error,fatal]

> 默认logger 为 ：`var logger = require('logger-email');`
+ var errorLog = logger.getLogger('error'); // errorLog.error('logs'); || errorLog.fatal('logs'); 能保存到日志文件
+ var requestLog = logger.getLogger('request'); // requestLog.error('logs'); || requestLog.fatal('logs'); 能保存到日志文件
+ var manualLog = logger.getLogger('manual'); // manualLog.warn('logs'); || manualLog.error('logs');|| manualLog.fatal('logs'); 能保存到日志文件
+ var defaultLog = logger.getLogger('default'); // 只在控制台输出，不保存到日志文件

+ 以上`errorLog`,`requestLog`,`manualLog`会输出日志到对应的文件：
`errorLog`-------------> `/defaultlogs/error/error_2018-12-06.log`
`requestLog`-----------> `/defaultlogs/request/request_2018-12-06.log`
`manualLog`------------> `/defaultlogs/manual/manual_2018-12-06.log`

### app.js 完整代码：
```sh
var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var app = express();

var loggerConfig = require('logger-email/config');
// 设置日志配置项
loggerConfig.setLogConfig({
    compress: true, //是否在生成第二个文件时将上一个压缩 如：error_2018-10-30.log.gz
    logPath: path.join(__dirname,'./defaultlogs/'),
    daysToKeep: 7,//保存7天,log4不起作用，单独方法删除文件
    attachments: true,// true 为发送附件，默认false
    onLineLink: 'http://127.0.1:3000/defaultlogs/' // send:link<required> 可访问的域名地址，查看日志用
});

// 设置邮件配置项（如果需要发送邮件）
loggerConfig.setEmailConfig({
    host: 'smtp.exmail.qq.com',
    port: 465,
    secure: true,// true for 465, false for other ports
    user: '****@qq.com', // generated ethereal user
    pass: '****', // generated ethereal password 
    from: '****@qq.com', // sender address
    to: '***@163.com', // list of receivers 多个邮箱","分开
    canSend: true,//是否可以发送邮件（false：不发送；true:发送）
    subject: '测试邮件啊啊',
});

// 要保证链接能访问到日志
app.use('/defaultlogs',express.static(path.join(__dirname, '../defaultlogs')));

var logger = require('logger-email');
var manualLog = logger.getLogger('manual'); // 手动输出
logger.sendDayLog();// 每日定时发送邮件
logger.appLogger(app); // 控制台输出日志

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/home',function (req,res,next){
    res.render('index',{
        title: 'aha'
    },function (err,html){
        manualLog.error("出错了");
        if (err){
            logger.template.ejsRenderError({
                page:'/home',
                req: req,
                error: err
            });
        }
        res.send(html);
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
    \n ^_^ logs ^_^
    \n http://127.0.0.1:3000 
    \n ===============================`);
});

```
## License
---
logger-email is licensed under the MIT license
