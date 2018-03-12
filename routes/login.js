var express = require('express');
var router = express.Router();

/**
 * login渲染界面请求
 */
router.get('/', function (req, res, next) {
    res.render("login");
});

/**
 * login的post请求,登录
 */
router.post('/', function (req, res, next) {
   res.send({
       success:true,
       info:"登陆成功"
   })
});


module.exports = router;