/**
 * 发送 smtp 邮件
 * daiyunzhou 2018-10-30 18:48
 * last modify time: 2018-10-31 14:48
 * last modify name: daiyunzhou
 *
 * Node.js v6+.
 */
'use strict';
var nodemailer = require('nodemailer');
var EMAILCONFIG = require('../config/email-config').options;

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  host: EMAILCONFIG.host,
  port: EMAILCONFIG.port,
  secure: EMAILCONFIG.secure,
  auth: {
    user: EMAILCONFIG.user,
    pass: EMAILCONFIG.pass
  }
});

/**
 * 发送邮件
 * @param {String} subject 邮件标题 
 * @param {String} text 邮件内容 
 * @param {Object} attachments 附件 
 * 
 * example：
 * var mailOptions = {
        from: EMAILCONFIG.from, // sender address
        to: EMAILCONFIG.to, // list of receivers
        subject: 'Hello 出bug了标题', // 邮件标题
        text: 'Hello world?内容', // plain text body
        attachments: [
        {   // file on disk as an attachment
            path: '/zhugelogs/error/error_2018-10-30.log' // stream this file
        },
        {   // file on disk as an attachment
            path: '/zhugelogs/info/info_2018-10-30.log' // stream this file
        }]
    };
 */
var sendEmail = function (subject, text, attachments) {
  console.log('-----------------sendemail-------------');

  // 要发送的邮件内容
  var mailOptions = {
    from: EMAILCONFIG.from,
    to: EMAILCONFIG.to,
    subject: subject || '项目日志',
    text: text || '项目日志内容'
  };

  // 判断是否需要发送文件
  if (attachments && attachments instanceof Array) {
    mailOptions.attachments = attachments;
  }
  console.log(subject);
  console.log(text);
  console.log(attachments);
  console.log(mailOptions);
  console.log(EMAILCONFIG.canSend);
console.log(EMAILCONFIG);

  // send mail with defined transport object
  // 判断是否可以发送邮件
  if (EMAILCONFIG.canSend) {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId); // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  }
};

module.exports = {
  sendEmail: sendEmail
};
