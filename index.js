/**
 * 2018-11-22 daiyunzhou
 * node日志系统入口
 * daiyunzhou 2018-12-02 12:50
 * last modify : 2018-12-04 13:50
 * last modify author : daiyunzhou
 */

var log4 = require('./logger/log4');
var logTpl = require('./logger/outPutLog');
var email = require('./email');
var sendDayLog = require('./email/sendDayLog');

module.exports = {
  getLogger: log4.getLogger, // getLogger method
  appLogger: log4.appLogger, // appLogger method
  template: logTpl, // log tpl
  email: email, // email api
  sendDayLog: sendDayLog // send log every day
};