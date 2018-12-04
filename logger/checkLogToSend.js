/**
 * 将本次日志加密保存，在发送邮件前先遍历文件，查找是否已经发送过了
 * 一天删除一次文件，每条ejs渲染失败的记录都以密文来标记
 * daiyunzhou 2018-11-07 20:10
 * last modify: 2018-11-08 10:53
 * last modify author: daiyunzhou
 */

var email = require('../email/index');
var LOGCONFIG = require('../config/log-config');
var moment = require('moment');
var crypto = require('crypto');
var fs = require('fs');
var secret = 'zhugezhaofang';

/**
 * 
 * 删除过期的错误ejs日志标志
 * @method deleteTagsFile
 * @param {String} logPath ejs错误内容的标志
 * @param {String} filename 当前使用的文件名
 */
function deleteTagsFile(logPath, filename) {
  // 遍历当前标志文件夹所有文件
  var checkFileIsExists = fs.existsSync(logPath + '/checklog');
  var currentFiles = []; // 所有文件
  if (checkFileIsExists) {
    currentFiles = fs.readdirSync(logPath + '/checklog');
    console.log('all files _____________________', currentFiles);
    if (currentFiles.length < 1) {
      return false;
    }
  }

  //判断有多少个可以删除，目的是回掉时可以知道当前操作的具体信息
  currentFiles.forEach(function(files, filesIndex) {
    console.log(files);
    if (files !== filename) {
      //删除文件
      fs.unlink(logPath + '/checklog/' + files, function(err) {
        if (err) {
          console.log('删除过期文件失败！！');
        } else {
          console.log('删除过期文件成功:', files);
        }
      });
    }
  });
}

/**
 * ejs错误日志
 * @method checkLogToSend
 * @param {String} logs 要检查发送的日志
 */
function checkLogToSend (logs) {
    // 将日志空格和换行去掉
    var str = logs.replace(/\n\s/g, '');
  
    // 将日志加密
    var cryptoStr = crypto
      .createHmac('sha256', secret)
      .update(str)
      .digest('hex');
  
    // 读取日志文件(需要判断是否有日志文件，如果没有需要新建一个，日期为文件名) 多久发一次合适？
    var logPath = LOGCONFIG.logPath;
    var filename = moment().format('YYYY-MM-DD') + '.txt';
    var cacheFile = logPath + 'checklog/' + filename;
    fs.existsSync(logPath) || fs.mkdirSync(logPath);
    fs.existsSync(logPath + 'checklog/') || fs.mkdirSync(logPath + 'checklog/');
  
    // 删除过期的标志文件
    deleteTagsFile(logPath, filename);
  
    var logsArr = [];
    var tag = true;
    var writeAndSend = function (err, data) {
      if (err) {
      //   console.log('----------------没有日志，直接保存-----------------------');
        // 发送邮件
        email.sendEmail('问答项目ejs渲染错误，出现空白页面！！！',logs,null);
        //保存到文件
        fs.appendFile(cacheFile, cryptoStr + '\n', 'utf8', function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log('----------------保存ejs错误标志成功--------------------');
          }
        });
      } else {
        logsArr = data.split('\n');
        logsArr.forEach(function (item) {
          if (item === cryptoStr) {
            tag = false;
          }
        });
  
        if (tag) {
          console.log('----------------需要保存--------------------');
          // 发送邮件
          email.sendEmail('问答项目ejs渲染错误，出现空白页面！！！',logs,null);
          //保存到文件
          fs.appendFile(cacheFile, cryptoStr + '\n', 'utf8', function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log('----------------保存ejs错误标志成功--------------------');
            }
          });
        } else {
          console.log('----------------不需要保存--------------------');
        }
      }
    };
  
    // 遍历读取到的文件内容，判断是否有相同问题
    fs.readFile(cacheFile, 'utf8', function (err, data) {
      if (err) {
        console.log('读取文件失败', err.name);
        // 创建并写入文件，发送邮件
        writeAndSend(err, data);
      } else {
        writeAndSend(err, data);
      }
    });
}
  
module.exports = checkLogToSend;