# 发送邮件功能
---

## 主要功能

+ 按天向指定邮箱发送前一天的日志（每天的凌晨0点0分30秒触发）；
+ 手动发送信息到指定邮箱；
+ 发送信|附件；

### 配置文件 `/zhuge-ask/util/email/email.js`


### 1. 定时任务向指定邮箱发送邮件

文件路径：`./sendDayLog.js`

使用方法：在app.js中添加如下代码；

```
require('./util/email/sendDayLog')();
```

### 2. 手动发送邮件

```
var email = require('./index');
// subject ： 邮件标题
// text : 邮件正文
// sendFiles : 附件路径
email.sendEmail(subject, text, sendFiles);
```

sendFiles参数如下(sendFiles==null则不发送附件)：

```
[{   // file on disk as an attachment
    path: '/zhugelogs/error/error_2018-10-30.log' // stream this file
},
{   // file on disk as an attachment
    path: '/zhugelogs/info/info_2018-10-30.log' // stream this file
}]
```



