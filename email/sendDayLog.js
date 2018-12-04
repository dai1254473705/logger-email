/**
 * 定时任务：凌晨1点1分30s发送前天日志到指定邮箱
 * daiyunzhou 2018-10-31 10:53
 * last modify time: 2018-11-13 12:27
 * last modify name: daiyunzhou
 *
 * 每分钟的第30秒触发： '30 * * * * *'
 * 每小时的1分30秒触发 ：'30 1 * * * *'
 * 每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'
 * 每月的1日1点1分30秒触发 ：'30 1 1 1 * *'
 * 2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'
 * 每周1的1点1分30秒触发 ：'30 1 1 * * 1'
 */
var schedule = require('node-schedule');
var email = require('./index');
var logLink = require('./getLogFileLink');
var logFile = require('./getLogFile');
var moment = require('moment');
var outPutLog = require('../logger/outPutLog');
var deleteFile = require('../logger/deleteFile');
var LOGCONFIG = require('../config/log-config').options;
var EMAILCONFIG = require('../config/email-config').options;
var logger = require('../logger/log4');
var logManual = logger.getLogger('manual');
module.exports = function () {
  var rule = new schedule.RecurrenceRule();
  rule.minute = 54;
  // 每天的凌晨0点0分30秒触发，50s发送邮件
  // schedule.scheduleJob('30 0 0 * * *', function () {
  schedule.scheduleJob(rule, function () {
    console.log('----------------------------执行定时任务----------20s后发送邮件---------------------');
    // 将要发送邮件的日志写入到每个日志文件夹（防止日志需要压缩时，不能自动生成压缩包，通过emailLogger方法触发生成压缩包）
    outPutLog.emailLogger();
    // 提前30s将有日志的文件类型输出一次，防止没有生成.gz压缩包
    setTimeout(function () {
      var getLogFileLink = logLink();
      var yesterdaystr = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
      var subject = EMAILCONFIG.subject || '每日node日志汇报';
      var text;

      // 判断是否需要发送附件
      var attachments = null;
      if ( LOGCONFIG.attachments ) {
        console.log('-------------将发送邮件附件--------------------------');
        attachments = logFile();
      }
      
      // 判断是否有日志
      if (getLogFileLink.length === 0) {
        text = moment(yesterdaystr).format('YYYY-MM-DD') + '无日志';
      } else {
        text = moment(yesterdaystr).format('YYYY-MM-DD') + '日志\n';
        getLogFileLink.forEach(function (item,index){
          text+=item.path+'\n';
        });
      }

      console.log('-------------发送邮件--------------------------');
      email.sendEmail(subject, text, attachments);
      // 删除过期文件
      deleteFile(['/error','/manual','/request'],LOGCONFIG.daysToKeep,function (err,data){
        if (err){
          logManual.info('删除日志失败',err);
        } else {
          logManual.info('删除日志成功',data);
        }
      });
    }, 2000);
  });
};
