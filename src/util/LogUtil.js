/**
 * Created with JetBrains WebStorm
 * User:jessie
 * Data:2018/3/8
 * Time:9:57
 *
 *
 * */


var path = require('path');
var log4js = require('log4js');
/**
 * 日志配置
 */
exports.configure = function () {
    log4js.configure(path.join(__dirname, "../../config/log4js.json"));
};


/* 暴露到应用的日志接口，调用该方法前必须确保已经configure过
 * @param name 指定log4js配置文件中的category。依此找到对应的appender。
 *              如果appender没有写上category，则为默认的category。可以有多个
 * @returns {Logger}
 */
exports.logger= function (name) {
    return log4js.getLogger(name);
};

/**
 * 用于express中间件，调用该方法前必须确保已经configure过
 * @returns {Function|*}
 */

exports.useLog = function () {
    return log4js.connectLogger(this.logger("app"), {level: "auto"});
};
