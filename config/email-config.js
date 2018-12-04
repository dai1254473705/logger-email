/**
 * 邮箱配置
 * daiyunzhou 2018-10-31 10:53
 * last modify time: 2018-12-04 15:08
 * last modify name: daiyunzhou
 */

// module.exports = {
//     host: 'smtp.exmail.qq.com',
//     port: 465,
//     secure: true,// true for 465, false for other ports
//     user: 'user email', // generated ethereal user
//     pass: 'user email password', // generated ethereal password 
//     from: 'sender address', // sender address
//     to: 'receiver address', // list of receivers 多个邮箱","分开
//     canSend: true,//是否可以发送邮件（false：不发送；true:发送）
// };
var config = {
    host: '',
    port: 465,
    secure: true,// true for 465, false for other ports
    user: '', // generated ethereal user
    pass: '', // generated ethereal password 
    from: '', // sender address
    to: '', // list of receivers 多个邮箱","分开
    canSend: false,//是否可以发送邮件（false：不发送；true:发送）
};
// 判断方法
var check = function (name,options,callback){
    if ( options[name] === null || options[name] === undefined ) {
        var err = new Error();
        err.name = name + ' --is required';
        err.message = name + ' --should be set value';
        if ( callback ) { callback(err,null); }
        throw err;
    }
};

var setEmailConfig = function (options,callback){
    // check options
    console.log('========================start set email config=============================');
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
        err.message = 'setEmailConfig recive object!';
        if ( callback ) { callback(err,null); }
        throw err;
    }
    // required options 
    var arr = ['host','port','secure','user','pass','from','to'];
    for (var key in arr) {
        check(arr[key],options,callback);
    }

    var result = {};

    // 仅允许 ['host','port','secure','user','pass','from','to',canSend] (目前是全部运行)修改
    result.host = options.host || config.host; 
    result.port = options.port || config.port; 
    result.secure = options.secure || config.secure; 
    result.user = options.user || config.user;
    result.pass = options.pass || config.pass;
    result.from = options.from || config.from;
    result.to = options.to || config.to;
    result.canSend = options.canSend || config.canSend;
  
    // config = Object.assign(config,result);
    config = result;
    console.log(config);
    console.log('========================set email config ok ===============================');
};
module.exports = {
    set: setEmailConfig,
    options: config
};