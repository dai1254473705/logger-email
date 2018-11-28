/**
 * 返回昨天保存的日志目录
 * daiyunzhou 2018-10-30 17:58
 * last modify time: 2018-10-31 14:53
 * last modify name: daiyunzhou
 */
var fs = require('fs');
var LOGCONFIG = require('../config/log-config');
var moment = require('moment');

// 获取日志文件名相同格式的时间格式
var yesterdayformat = function () {
  var yesterdaystr = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
  return moment(yesterdaystr).format('YYYY-MM-DD');
};

// 获取要发送的日志文件
var getLogs = function () {
  var logPath = LOGCONFIG.logPath;
  var errorlog = logPath + 'error/error_' + yesterdayformat() + '.log.gz';
  var requestlog = logPath + 'request/request_' + yesterdayformat() + '.log.gz';
  var mamullog = logPath + 'manual/manual_' + yesterdayformat() + '.log.gz';

  //判断文件是否存在
  var errorIsSave = fs.existsSync(errorlog);
  var infoIsSave = fs.existsSync(requestlog);
  var mamulIsSave = fs.existsSync(mamullog);

  var sendFile = [];
  if (errorIsSave) {
    sendFile.push({ path: errorlog });
  }
  if (errorIsSave) {
    sendFile.push({ path: requestlog });
  }
  if (mamulIsSave) {
    sendFile.push({ path: mamullog });
  }

  //判断是否是空对象
  return sendFile;
};

module.exports = getLogs;
