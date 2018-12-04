/**
 * 邮箱配置
 * daiyunzhou 2018-10-31 10:53
 * last modify time: 2018-10-31 10:53
 * last modify name: daiyunzhou
 * 
 * 腾讯企业邮箱配置
 */

module.exports = {
    host: 'smtp.exmail.qq.com',
    port: 465,
    secure: true,// true for 465, false for other ports
    user: 'user email', // generated ethereal user
    pass: 'user email password', // generated ethereal password 
    from: 'sender address', // sender address
    to: 'receiver address', // list of receivers 多个邮箱","分开
    canSend: true,//是否可以发送邮件（false：不发送；true:发送）
};
