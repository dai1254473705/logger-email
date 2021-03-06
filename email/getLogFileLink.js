/**
 * 返回昨天保存的日志目录
 * daiyunzhou 2018-10-30 17:58
 * last modify time: 2018-11-13 11:48
 * last modify name: daiyunzhou
 */
var fs = require('fs');
var LOGCONFIG = require('../config/log-config').options;
var moment = require('moment');

// 获取日志文件名相同格式的时间格式
var yesterdayformat = function () {
  var yesterdaystr = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
  return moment(yesterdaystr).format('YYYY-MM-DD');
};

// 获取要发送的日志文件
var getLogs = function () {
  //  上线后修改成可用的域名地址
  var linkPath = LOGCONFIG.onLineLink ;
  var logPath = LOGCONFIG.logPath;
  // 判断是否压缩过
  var errorlog = '';
  var requestlog = '';
  var mamullog = '';
  // 判断是否压缩过
  if ( LOGCONFIG.compress ) {
    errorlog = 'error/error_' + yesterdayformat() + '.log.gz';
    requestlog = 'request/request_' + yesterdayformat() + '.log.gz';
    mamullog = 'manual/manual_' + yesterdayformat() + '.log.gz';
  } else {
    errorlog = 'error/error_' + yesterdayformat() + '.log';
    requestlog = 'request/request_' + yesterdayformat() + '.log';
    mamullog = 'manual/manual_' + yesterdayformat() + '.log';
  }
  //判断文件是否存在
  var errorIsSave = fs.existsSync( logPath +errorlog);
  var infoIsSave = fs.existsSync(logPath+requestlog);
  var mamulIsSave = fs.existsSync(logPath + mamullog);

  var sendFile = [];
  if (errorIsSave) {
    sendFile.push({ path: linkPath + errorlog });
  }
  if (infoIsSave) {
    sendFile.push({ path: linkPath + requestlog });
  }
  if (mamulIsSave) {
    sendFile.push({ path: linkPath + mamullog });
  }

  //判断是否是空对象
  return sendFile;
};

module.exports = getLogs;
