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
var getLogFile = require('./getLogFileLink');
var moment = require('moment');
var outPutLog = require('../logger/outPutLog');
var deleteFile = require('../logger/deleteFile');
var LOGCONFIG = require('../config/log-config');
var logger = require('../logger/log4');
var logManual = logger.getLogger('manual');
module.exports = function () {
  // var rule = new schedule.RecurrenceRule();
  // rule.minute = 10;
  // 每天的凌晨0点0分30秒触发，50s发送邮件
  schedule.scheduleJob('30 0 0 * * *', function () {
  // schedule.scheduleJob(rule, function () {
    console.log('----------------------------执行定时任务----------30s后发送邮件---------------------');
    // 将要发送邮件的日志写入到每个日志文件夹
    outPutLog.emailLogger();

    // 提前30s将有日志的文件类型输出一次，防止没有生成.gz压缩包
    setTimeout(function () {
      var logsFile = getLogFile();
      console.log('-------------邮件附件--------------------------');
      var yesterdaystr = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
      var sendFiles = logsFile.length === 0 ? null : logsFile;
      var subject = '问答项目：每日node日志汇报';
      var text;
  
      if (logsFile.length === 0) {
        text = moment(yesterdaystr).format('YYYY-MM-DD') + '无日志';
      } else {
        text = moment(yesterdaystr).format('YYYY-MM-DD') + '日志\n';
        logsFile.forEach(function (item,index){
          text+=item.path+'\n';
        });
      }

      console.log('-------------发送邮件--------------------------');
      email.sendEmail(subject, text, null);
      // 删除过期文件
      deleteFile(['/error','/manual','/request'],LOGCONFIG.daysToKeep,function (err,data){
        if (err){
          logManual.info('删除日志失败',err);
        } else {
          logManual.info('删除日志成功',data);
        }
      });
    }, 20000);
  });
};
