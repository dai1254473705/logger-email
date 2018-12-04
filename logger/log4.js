/**
 * 日志文件
 * daiyunzhou 2018-10-29 18:00
 * last modify time: 2018-10-30 15:43
 * last modify name: daiyunzhou
 *
 * 参考地址：https://log4js-node.github.io/log4js-node/dateFile.html
 * 日志等级：[trace,debug,info,warn,error,fatal]
 * log4js: '^3.0.6'
 * node: '>=6.0'
 * 
 * 在其他文件中的使用方法：
 * var log4 = require('../util/logger/log4');
 * var log_error = log4.getLogger('error');
 * var log_info = log4.getLogger('info');
 * var log_debug = log4.getLogger();||log4.getLogger('default');
 * 
 * ！注意：
 *      logg_error 使用时，只有error,fatal 可以输出
 *      logg_info 使用时，只有info,warn,error,fatal 可以输出
 */
var log4js = require('log4js');
var path = require('path');
var fs = require('fs');
var LOGCONFIG = require('../config/log-config').options;

//判断logs文件是否存在，不存在就创建
console.log('----------------LOGCONFIG----------------------',LOGCONFIG);
fs.existsSync(LOGCONFIG.logPath) || fs.mkdirSync(LOGCONFIG.logPath);

//日志级别配置文件
log4js.configure({
  disableClustering: true,
  appenders: {
    // 控制台输出日志
    debugFile: {
      type: 'stdout'
    },
    // 输出错误日志到文件
    errorFile: {
      type: 'dateFile',
      filename: LOGCONFIG.logPath + 'error/error',
      pattern: LOGCONFIG.pattern,
      layout: LOGCONFIG.layout,
      compress: LOGCONFIG.compress,
      daysToKeep: LOGCONFIG.daysToKeep,
      keepFileExt: LOGCONFIG.keepFileExt,
      alwaysIncludePattern: LOGCONFIG.alwaysIncludePattern
    },
    // 输出请求接口时的普通信息
    reqFile: {
      type: 'dateFile',
      filename: LOGCONFIG.logPath + 'request/request',
      pattern: LOGCONFIG.pattern,
      layout: LOGCONFIG.layout,
      compress: LOGCONFIG.compress,
      daysToKeep: LOGCONFIG.daysToKeep,
      keepFileExt: LOGCONFIG.keepFileExt,
      alwaysIncludePattern: LOGCONFIG.alwaysIncludePattern
    },
    // 手动输出日志
    manualFile: {
      type: 'dateFile',
      filename: LOGCONFIG.logPath + 'manual/manual',
      pattern: LOGCONFIG.pattern,
      layout: LOGCONFIG.layout,
      compress: LOGCONFIG.compress,
      daysToKeep: LOGCONFIG.daysToKeep,
      keepFileExt: LOGCONFIG.keepFileExt,
      alwaysIncludePattern: LOGCONFIG.alwaysIncludePattern
    }
  },
  categories: {
    //定义日志级别,将日志同时输出到控制台和日志文件
    error: {
      appenders: ['debugFile', 'errorFile'],
      level: 'error'
    },
    //定义error级别
    request: {
      appenders: ['debugFile', 'reqFile'],
      level: 'error'
    },
    //手动输出的错误日志(项目中觉得可能出问题的地方使用，单独存储在另一个文件夹)
    manual: {
      appenders: ['debugFile', 'manualFile'],
      level: 'info'
    },
    default: {
      appenders: ['debugFile'],
      level: 'debug'
    }
  }
});

module.exports = {
  /**
   * 手动调用的日志方法
   * @param  {String} name 取categories 值 [ error,info,default]
   * @return {Objcet} getLogger    返回调用日志的方法
   */
  getLogger: function (name) {
    return log4js.getLogger(name || 'default');
  },

  /**
   * 在app.js 调用和express配合使用，作为中间件
   * @param  {Object} app    var app = express();
   * @return {Object} null   作为express中间件使用
   *
   * format:
   *   - `:req[header]` ex: `:req[Accept]`
   *   - `:res[header]` ex: `:res[Content-Length]`
   *   - `:http-version`
   *   - `:response-time`
   *   - `:remote-addr`
   *   - `:date`
   *   - `:method`
   *   - `:url`
   *   - `:referrer`
   *   - `:user-agent`
   *   - `:status`
   */
  appLogger: function (app) {
    app.use(
      log4js.connectLogger(log4js.getLogger('default'), {
        level: 'debug',
        // format: '[:remote-addr :method :url :status :response-timems][:referrer HTTP/:http-version :user-agent]'//自定义输出格式
        format: '[:remote-addr :method  :status  :url :response-timems]' //自定义输出格式
      })
    );
  }
};
