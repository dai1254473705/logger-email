# logger 日志使用方法
---

## 主要功能

+ 日志输出到控制台；
+ 日志保存到指定文件，按天生成；
+ 输出日志格式设置；
+ 日志压缩（需要开启：已开启，开启后需要修改email模块下的文件路径，压缩包后缀为.gz,发送邮件后不方便实时预览）

### 配置文件 `/zhuge-ask/static-config/log-config.js`


## 1. 日志保存路径

(1) `/zhugelogs/error/error_2018-10-31.log`

> 保存app.js文件中捕获的错误日志，和ejs渲染报错时的日志；

(2) `/zhugelogs/request/request_2018-10-31.log`

> 保存zgrequest.js 中request模块请求接口时catch exception和 请求接口失败返回error时的日志；

(3) `/zhugelogs/manual/manual_2018-10-31.log`

> 在coding过程中，可能会出现报错的地方，需要单独调用方法实现；

### 2. 在app.js中使用

+ 在app.js中作为中间件，在控制台输出可控格式日志；
+ 在app.js中捕获404等错误状态，并将其输出到文件；

> 去掉了morgan

```
// var logger = require('morgan');
var log4 = require('./util/logger/log4');
var outPutLog = require('./util/logger/outPutLog');
...others code 

// 使用log4代替了morgan,只做控制台输出，不写入文件
log4.appLogger(app);
// app.use(logger('dev'));


// error handler
app.use(function (err, req, res, next) {
    // output error logs 
    outPutLog.appJsError(err,req);
	...others code
});

```

### 3. 在zgrequest.js中使用

+ 保存`try{}catch(error){}` 中的error
+ 请求完成后，没能成功请求接口，保存日志；

```
	var outPutLog = require('../util/logger/outPutLog');
	
    req.post(url, urlPara, function (err, res, body) {
		var endTime = new Date().getTime();
        var durTime = endTime - strTime;
        try {
            if (err){
                // ==================catch error start==============================
                outPutLog.requestError({
                    durTime: durTime,
                    ip: request.ip,
                    url: url,
                    urlPara: urlPara,
                    error: err,
                    body: body
                });
                // ==================catch error end==============================
               ...others code
            } 
        } catch (e) {
            // ==================catch error start==============================
            outPutLog.requestCatchError({
                durTime: durTime,
                ip: request.ip,
                url: url,
                urlPara: urlPara,
                error: e,
                body: body
            });
            // ==================catch error end================================
			...others code
        }
    });
```

### 4. 在render ejs 的时候使用

+ 将 ejs 渲染出错时的日志保存

```
var log4 = require('../../../util/logger/log4');
var logger = log4.getLogger('manual');
var ejsLogger = require('../../../util/logger/outPutLog');

res.render(pagePath, {
    params: '',
},function (err,html){
	if (err) {
        ejsLogger.ejsRenderError({
            page: pagePath,
            ip: req.ip,
            error: err
        });
    }
    res.send(html);
    res.end();
});
```

### 5. 在其他情况下输出错误日志

```
var log4 = require('../../../util/logger/log4');
var logger = log4.getLogger('manual');

logger.error('这里可能要出错，我也不知道为什么，这是一个手动输出日志文件的案例');

```