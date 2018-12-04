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
module.exports = {
  pattern: '_yyyy-MM-dd.log',
  layout: {
    type: 'pattern',
    pattern: '%d %p %c %z %m'
  }, //定义日志输出格式
  compress: false, //是否在生成第二个文件时将上一个压缩 如：error_2018-10-30.log.gz
  logPath: path.join(__dirname,'../../zhugelogs/'),
  keepFileExt: false,
  daysToKeep: 7,//保存7天,log4不起作用，单独方法删除文件
  alwaysIncludePattern: true,
  onLineLink: 'http://127.0.1:3000/ask/zhugeasklogs/' //可访问的域名地址，查看日志用
};
