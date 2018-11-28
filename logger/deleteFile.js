/**
 * 删除过期文件
 * daiyunzhou 2018-11-05 10:10
 * last modify: 2018-11-05 15:32
 * last modify author: daiyunzhou
 */

var LOGCONFIG = require('../config/log-config');
var fs = require('fs');
var moment = require('moment');
/**
 * 删除过期文件
 * @param  {Array} filePath   放日志的文件夹路径数组
 * @param  {String} day 保留日志时间（天）
 * @return {Boolean} 是否删除文件成功
 */
module.exports = function (filePath,day,callback){
	try {
		if (!callback){
			callback = function (){};
		}
		// 判断是否设置了删除文件
		if (!LOGCONFIG.daysToKeep || typeof(LOGCONFIG.daysToKeep) !== 'number'){
			callback({
				name: 'fail',
				message: 'not allowed to delete log files'
			},null);
			return false;
		}
		// 判断指定文件路径是否存在
		if ( !(filePath instanceof Array) ){
			callback({
				name: 'fail',
				message: 'The filepath is not a Array type'
			},null);
			return false;
		}
		// 判断指定时间是否正确'2018-11-03'
		if (!day) {
			callback({
				name: 'fail',
				message: 'you got a Invalid Date'
			},null);
			return false;
		}
		var expireTime = Number(moment(new Date().getTime() - day * 24 * 60 * 60 * 1000).format('YYYY-MM-DD').replace(/-/ig,''));
		if (!expireTime) {
			callback({
				name: 'fail',
				message: 'expireTime format error'
			},null);
			return false;
		}
		var deleteFileGroups = [];//要删除的文件
		var failDeleteGroups = [];//删除失败的文件
		var allNumber = 0;//全部日志文件
		var needDelete = []; //需要删除的日志
		var startTime = new Date().getTime();
		var endTime = 0;
		// 遍历指定文件夹 
		filePath.forEach(function (item,index) {
			var fileName = LOGCONFIG.logPath+item;
			// 判断文件夹是否存在
			var checkFile = fs.existsSync(fileName);
			var reg = /[\d+-]+/;
			var currentDelete = []; //当前循环删除的日志
			if (checkFile){
				var currentFiles = fs.readdirSync(fileName);
				//判断有多少个可以删除，目的是回掉时可以知道当前操作的具体信息
				currentFiles.forEach(function (files,filesIndex) {
					allNumber++;
					var fileTime = Number(files.match(reg).join('-').replace(/-/ig,''));
					if (!fileTime || fileTime >= expireTime){
						return false;
					}
					needDelete.push(files);
					currentDelete.push(files);
				});

				if (currentDelete.length == 0) {
					callback(null,{
						code: 'success',
						message: '没用需要删除的文件'
					});	
					return false;
				}
				// 删除操作
				currentDelete.forEach(function (files,filesIndex) {
					//删除文件
					fs.unlink(fileName+'/'+files, function (err) {
						if (err) {
							failDeleteGroups.push(files);
						} else {
							deleteFileGroups.push(files);
						}
						if (index === filePath.length-1 && filesIndex === currentDelete.length-1){
							endTime = new Date().getTime();
							callback(null,{
								code: 'success',
								message: 'delete ok!',
								data: {
									allNumber: allNumber,//日志总数
									needDelete: needDelete ,// 需要删除的日志数量
									deleteNumber: deleteFileGroups.length,//删除成功数量
									failDelete: failDeleteGroups,// 删除失败
									delete: deleteFileGroups,//删除成功的日志
									durTime: endTime - startTime+'ms' // 耗时
								}
							});	
						}
					});
				});		
			} else {
				callback(null,{
					code: 'success',
					message: '没用需要删除的文件',
					data: {
						fileName: fileName
					}
				});	
			}
		});
	} catch (e) {
		callback({
			name: 'fail',
			message: 'catch error '+ e.message
		},null);
		return false;
	}
};