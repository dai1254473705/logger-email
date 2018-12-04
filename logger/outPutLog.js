/**
 * 输出日志文件方法
 * daiyunzhou 2018-10-30 15:56
 * last modify time: 2018-11-01 14:09
 * last modify name: daiyunzhou
 *
 * 集群解决方法：
 * https://log4js-node.github.io/log4js-node/clustering.html
 */

var log4 = require('./log4');
var logUtil = require('./logUtil');
var logger = log4.getLogger('error'); // 非接口请求error
var logger2 = log4.getLogger('request'); //接口请求error
var logger3 = log4.getLogger('manual'); // 手动输出内容
var checkLogToSend = require('./checkLogToSend');// ejs 空白页，发送日志
var LOGCONFIG = require('../config/log-config');
var linkPath = LOGCONFIG.onLineLink ;
var moment = require('moment');

/**
 * app.js 中捕获异常输出日志
 * @param {Object} err 错误信息
 * @param {Object} req request信息
 */
var appJsError = function (err, req) {
  var logs = {
    clientIp: logUtil.getClientIp(req),
    clientUrl: logUtil.getClientUrl(req),
    method: req.method,
    errName: err.name,
    errMessage: err.message,
    errStack: err.stack
  };
  // logs 和 err 需要分开写入，否则会丢失err
  logger.error('app.js捕获到异常:', logs);
};

/**
 * 请求接口捕获error
 * @param {Objcet} options
 */
var requestCatchError = function (options) {
  var errorlog = {
    durTime: options.durTime, // 接口请求时间
    clientIp: logUtil.getClientIp(options.req),// 客户端ip
    clientUrl: logUtil.getClientUrl(options.req),// 客户端url
    method: options.method,// 请求方式
    apiUrl: options.url,// 接口地址
    requestParams: options.urlPara,// 请求参数
    body: options.body,// 接口返回参数
    errName: options.error.name,// 错误信息
    errMessage: options.error.message,// 错误信息
    errStack: options.error.stack// 错误信息
  };
  logger2.error('请求接口捕获error:', errorlog);
};

/**
 * 请求接口返回error
 * @param {Objcet} options
 */
var requestError = function (options) {
  var errorlog = {
    durTime: options.durTime, // 接口请求时间
    clientIp: logUtil.getClientIp(options.req),// 客户端ip
    clientUrl: logUtil.getClientUrl(options.req),// 客户端url
    method: options.method,// 请求方式
    apiUrl: options.url,// 接口地址
    requestParams: options.urlPara,// 请求参数
    body: options.body,// 接口返回参数
    errName: options.error.name,// 错误信息
    errMessage: options.error.message,// 错误信息
    errStack: options.error.stack// 错误信息
  };
  logger2.error('请求接口返回error:', errorlog);
};

/**
 * 捕获ejs渲染error日志,ejs 不渲染errName ,errMessage,errStack ，直接输出error信息，防止格式错乱找不到bug
 * @param {Objcet} options
 * @param {String} options.page ejs页面模板路径
 * @param {String} options.req request 
 * @param {Objcet} options.error 错误信息
 */
var ejsRenderError = function (options) {
  var errorlog = {
    clientIp: logUtil.getClientIp(options.req),// 客户端ip
    clientUrl: logUtil.getClientUrl(options.req),// 客户端url
    method: options.req.method,// 请求方式
    pagePath: options.page
  };
  var link = linkPath + 'error/error_' + moment().format('YYYY-MM-DD') + '.log';
  var emailText = JSON.stringify(errorlog)+'\n\n\n'+options.error.toString()+'\n\n\n详情查看：'+link;
  checkLogToSend(emailText);
  logger.error('ejs渲染error:', errorlog,options.error);
};

/**
 * 在当天输出文件中添加发送邮件日志，出发压缩前一天日志的action
 * 防止发送邮件时，没有找到前一天的.gz包
 */
var emailLogger = function () { 
  logger.error('-------------------------20s后将自动发送邮件------------------------------');
  logger2.error('-------------------------20s后将自动发送邮件------------------------------');
  logger3.error('-------------------------20s后将自动发送邮件------------------------------');
};

module.exports = {
  appJsError: appJsError,
  requestCatchError: requestCatchError,
  requestError: requestError,
  ejsRenderError: ejsRenderError,
  emailLogger: emailLogger
};
