/**
 * 2018-11-22 daiyunzhou
 * node日志系统入口
 */
// for versions before node v0.8 when there weren't `fs.existsSync`
function exists(file) {
  try {
    if (fs.statSync(file).isFile()) {
      return true;
    }
  } catch (e) {
    return false;
  }
}
module.exports = exists;