/**
 * 日志输出配置管理
 * daiyunzhou 2018-10-31 11:31
 * last modify time: 2018-10-31 11:31
 * last modify name: daiyunzhou
 *
 * 参考：
 * https://log4js-node.github.io/log4js-node/layouts.html
 *  %r time in toLocaleTimeString format
    %p log level
    %c log category
    %h hostname
    %m log data
    %d date, formatted - default is ISO8601, format options are: ISO8601, ISO8601_WITH_TZ_OFFSET, ABSOLUTE, DATE, or any string compatible with the date-format library. e.g. %d{DATE}, %d{yyyy/MM/dd-hh.mm.ss}
    %% % - for when you want a literal % in your output
    %n newline
    %z process id (from process.pid)
    %x{<tokenname>} add dynamic tokens to your log. Tokens are specified in the tokens parameter.
    %X{<tokenname>} add values from the Logger context. Tokens are keys into the context values.
    %[ start a coloured block (colour will be taken from the log level, similar to colouredLayout)
    %] end a coloured block
 */
var path = require('path');
var config = {
  pattern: '_yyyy-MM-dd.log',
  layout: {
    type: 'pattern',
    pattern: '%d %p %c %z %m'
  }, //定义日志输出格式
  compress: false, //是否在生成第二个文件时将上一个压缩 如：error_2018-10-30.log.gz
  logPath: path.join(__dirname,'../../defaultlogs/'),
  keepFileExt: false, //boolean (default false) - preserve the file extension when rotating log files (file.log becomes file.2017-05-30.log instead of file.log.2017-05-30).
  daysToKeep: 7,//保存7天,log4不起作用，单独方法删除文件
  alwaysIncludePattern: true,// boolean (default false) - include the pattern in the name of the current log file as well as the backups.daysToKeep - integer (default 0) - if this value is greater than zero, then files older than that many days will be deleted during log rolling.
  attachments: false,// true 为发送附件，默认false
  onLineLink: 'http://127.0.1:3000/defaultlogs/' //可访问的域名地址，查看日志用
};

// check keys
var check = function (name,options,callback){
  if ( options[name] === null || options[name] === undefined ) {
      var err = new Error();
      err.name = name + ' --is required';
      err.message = name + ' --should be set value';
      if ( callback ) { callback(err,null); }
      throw err;
  }
};

var setLogConfig = function (options,callback){
  // check options
  console.log('========================start set log config=============================');
  if ( !options ) {
      var err = new Error();
      err.name = 'not defined error';
      err.message = 'You must set the value';
      if ( callback ) { callback(err,null); }
      throw err;
  }

  if ( typeof options !== 'object') {
      var err = new Error();
      err.name = 'type error';
      err.message = 'setLogConfig recive object!';
      if ( callback ) { callback(err,null); }
      throw err;
  }
  // required options 
  var arr = ['logPath'];
  for (var key in arr) {
      check(arr[key],options,callback);
  }
  var result = {};

  // 仅允许 [layout,compress,logPath,daysToKeep,onLineLink] 修改
  // result.pattern = options.pattern || config.pattern; // file name 
  // result.layout = options.layout || config.layout; // log format
  result.compress = options.compress || config.compress; // compress
  result.logPath = options.logPath || config.logPath; // file path
  result.daysToKeep = options.daysToKeep || config.daysToKeep; // days to keep 
  result.attachments = options.attachments || config.attachments; // days to keep 
  result.onLineLink = options.onLineLink || config.onLineLink; // link 
  config= Object.assign(config,result);
  console.log(config);
  console.log('========================set log config ok ===============================');
};

module.exports = {
  set: setLogConfig,
  options:config
};
