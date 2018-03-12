//加载依赖库
var express = require('express');
var session = require('express-session');
var RedisStore = require("connect-redis")(session);
var path = require('path');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var ep = require('express-promise');
var domain = require('domain');

var index = require('./routes/index');
var login = require('./routes/login');

var LogUtil = require('./src/util/LogUtil');
//创建项目实例
var app = express();

//定义日志
LogUtil.configure();

app.use(LogUtil.useLog());

var logger = LogUtil.logger("app");

app.set('view engine', 'ejs');
// 定义EJS模板引擎和模板文件位置，也可以使用jade或者其他模型引擎
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'html');
app.engine('.html', ejs.__express);//使用html渲染

// 定义静态文件目录 linux下必须写清楚
app.use(express.static(path.join(__dirname, '/assets')));//静态文件
// 定义静态文件目录 linux下必须写清楚
app.use(express.static('assets'));//静态资源中，不能包括页面内

// 定义icon图标
//app.use(favicon(path.join(__dirname, 'portal', 'favicon.ico')));

// 定义数据解析器
app.use(bodyParser.json({
    limit: '50mb'
}));//默认为1mb

app.use(bodyParser.raw({
    limit: '50mb'
}));//默认为1mb
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));
// 定义cookie解析器
//1.5.0以上不需要cookieParser 二者要一致
// app.use(cookieParser('portal cat'));


app.use(ep());
// 匹配路径和路由
//定义session  使用redis
app.use(session({
    secret: 'treme cat',
    name: 'treme',
    maxAge: 1800000,
    cookie: {
        maxAge: 1800000
    },
    store: new RedisStore({
        host: '127.0.0.1',
        port: '6379',
        ttl: 1800,
        db: 5,
        pass: 'treme',
        prefix: 'psess:',
        logErrors: true
    }),
    resave: true,
    saveUninitialized: true,
    key: "treme.sid"
}));


//登录过滤
app.use(function (req, res, next) {
    //防止session再重连
    var url = req.originalUrl;
    var date = new Date();
    if (!req.session) {
        return next(new Error('session is reconnecting '));
    }

    var url = req.originalUrl.toLowerCase();
    if (!url.match(/login/)) {
        var flag = true;
        if (flag !== false) {
            if (flag !== true) {
                flag.then(function (r) {
                    if (r.success) {
                        next();
                    } else {
                        if (url === "handler.do") {
                            return res.send({
                                success: false,
                                info: 'NO_PERMISSION'
                            });
                        } else {
                            return res.redirect('login');
                        }
                    }
                });
            } else {
                next();
            }
        } else {
            if (url === "handler.do") {
                return res.send({
                    success: false,
                    info: 'NO_PERMISSION',
                });
            } else {
                return res.redirect("login");
            }
        }
    } else {
        next();
    }
});

app.use('/', index);
app.use(/\/index(.html)?/, index);
app.use(/\/login(.html)?/, login);


process.on('uncaughtException', function (err) {
    logger.error("uncaughtException ERROR");
    if (typeof err === 'object') {
        if (err.message) {
            logger.error('ERROR: ' + err.message)
        }
        if (err.stack) {
            //err.stack
            logger.error("出错了");
        }
    } else {
        logger.error('argument is not an object');
    }
});


//引入一个domain的中间件，将每一个请求都包裹在一个独立的domain中
//domain来处理异常
app.use(function (req, res, next) {
    var d = domain.create();
    //监听domain的错误事件
    d.on('error', function (err) {
        logger.error('捕获到错误');
        res.status(err.status || 500);
        var stackInfo = err.stack.substring(0, err.stack.indexOf('('));
        logger.info(stackInfo);
        res.render('error', {
            message: err.message,
            stack: stackInfo
        });
        d.dispose();
    });
    d.add(req);
    d.add(res);
    d.run(next);
});


// 获取404错误进行处理
app.use(function (req, res, next) {
    console.log(404);
    var err = new Error('没有找到');
    err.status = 404;
    next(err);
});


module.exports = app;