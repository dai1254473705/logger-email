/**
 * 获取client ip v4
 * @param  {Object} req request
 * @return {String}     ipv4
 * 
 * 如果后期ip不对： 
 *.replace(':remote-addr',req.socket && (req.socket.remoteAddress || (req.socket.socket && req.socket.socket.remoteAddress)))
 *.replace(':remote-addr', req.headers['x-forwarded-for'] || req.connection.remoteAddress)
 */
function getClientIp (req) {
	try {
		if (!!req){
			var chooseIp = req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress || '';
			var ip = chooseIp.match(/\d+.\d+.\d+.\d+/);
			return ip ? ip.join('.') : null ;
		} else {
			console.warn('请传入req！！！');
			return null;
		}
	} catch (e){
		console.error(e);
		return null;
	}
};

/**
 * 获取当前浏览器url
 * @param {Objcet} req request
 * @return {String} 浏览器完整url
 */
function getClientUrl (req) {
	try {
		if ( !!req){
			return req.protocol + '://' + req.headers.host + req.originalUrl;
		} else {
			console.warn('请传入req！！！');
			return null;
		}
	} catch (e){
		console.error(e);
	}
};

module.exports = {
	getClientIp: getClientIp,
	getClientUrl: getClientUrl
};

