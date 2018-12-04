/**
 * 2018-11-22 daiyunzhou
 * node日志系统配置入口
 * daiyunzhou 2018-12-02 12:50
 * last modify : 2018-12-04 13:50
 * last modify author : daiyunzhou
 */

var emailConfig = require('./config/email-config');
var logConfig = require('./config/log-config');

module.exports = {
  setEmailConfig:emailConfig.set, // set email options 
  setLogConfig: logConfig.set, // set log opptions
};