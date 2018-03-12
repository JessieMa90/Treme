/**
 * Created with JetBrains WebStorm
 * User:jessie
 * Data:2017/12/21
 * Time:17:18
 *
 */
import KinerCode from "../KinerCode";
export default {
    setCookie: function (NameOfCookie, value, expiredays) {
        //@参数:三个变量用来设置新的cookie:
//cookie的名称,存储的Cookie值,
// 以及Cookie过期的时间.
// 这几行是把天数转换为合法的日期

        var ExpireDate = new Date();
        ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000));

// 下面这行是用来存储cookie的,只需简单的为"document.cookie"赋值即可.
// 注意日期通过toGMTstring()函数被转换成了GMT时间。

        document.cookie = NameOfCookie + "=" + escape(value) +
            ((expiredays == null) ? "" : "; expires=" + ExpireDate.toGMTString());
    },
    getCookie: function (NameOfCookie) {

// 首先我们检查下cookie是否存在.
// 如果不存在则document.cookie的长度为0

        if (document.cookie.length > 0) {

// 接着我们检查下cookie的名字是否存在于document.cookie

// 因为不止一个cookie值存储,所以即使document.cookie的长度不为0也不能保证我们想要的名字的cookie存在
//所以我们需要这一步看看是否有我们想要的cookie
//如果begin的变量值得到的是-1那么说明不存在

            var begin = document.cookie.indexOf(NameOfCookie + "=");
            if (begin != -1) {

// 说明存在我们的cookie.

                begin += NameOfCookie.length + 1;//cookie值的初始位置
                var end = document.cookie.indexOf(";", begin);//结束位置
                if (end == -1) end = document.cookie.length;//没有;则end为字符串结束位置
                return unescape(document.cookie.substring(begin, end));
            }
        }

        return null;

// cookie不存在返回null
    },
    ///删除cookie
    delCookie: function (NameOfCookie) {
// 该函数检查下cookie是否设置，如果设置了则将过期时间调到过去的时间;
//剩下就交给操作系统适当时间清理cookie啦

        if (this.getCookie(NameOfCookie)) {
            document.cookie = NameOfCookie + "=" +
                "; expires=Thu, 01-Jan-70 00:00:01 GMT";
        }
    },
    getUrlParameter: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return r[2];
        return null;
    },
    /**
     * 获取字符串的字节长度
     * @param s
     *
     */
    getByteLength: function (s) {
        return (s || "").toString().trim().replace(/[^\x00-\xff]/g, "**").length;
    },
    /**
     * 判断对象是否为{}或null
     * @param obj
     *
     */
    isEmpty: function (obj) {
        let str = JSON.stringify(obj);
        return str === "null" || str === "{}" || false;
    },
    isPropsEqual: function (obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    },
    getSize: function (n, type) {
        var size = "0kb";
        if (n) {
            var t = type || "B";
            if (t === 'M') {
                if (n > 1) {
                    size = n.toFixed(2) + "M";
                } else {
                    size = (n * 1024).toFixed(2) + "kb";
                }
            } else {
                if (n < 1024) {
                    size = n + "b";
                } else if (n >= 1024 && n < 1048576) {
                    size = (n / 1024).toFixed(2) + 'kb';

                } else {
                    size = (n / 1024 / 1024).toFixed(2) + "M";
                }
            }
        }
        return size;
    },
    getDate: function (str) {
        //如果为毫秒数
        return str &&
            new Date(str).toLocaleDateString().replace('/', '-').split && new Date(str).toLocaleDateString().replace(/\//g, '-').split(" ")[0] || "";
    },
    // 获取url参数
    queryString: function (key) {
        return (document.location.search.match(new RegExp("(?:^\\?|&)" + key + "=(.*?)(?=&|$)")) || ['', null])[1];
    },
    //判断设备类型
    getAgent: function () {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return "mobile";
        } else {
            return "pc";
        }
    },
    trim: function (str) {
        return str && (str = str.toString()) && str.replace(/(^\s*)|(\s*$)/g, "") || "";
    },
    capitalize: function (str) {
        return str && typeof str === "string" && (str.substring(0, 1).toUpperCase() + str.substring(1, str.length)) || "";
    },
    openWin: function (url, flag) {
        var target = flag ? "_self" : "_blank";
        var a = document.createElement('a');
        a.setAttribute('target', target);
        a.setAttribute('href', url);
        a.setAttribute('style', "visibility:hidden;z-index:100; position:absolute;top:5px;left:5px;float:left display:inline-block");
        var button = document.createElement('button');
        button.setAttribute('style', "display:inline-block;width:100px;height:100px;");
        a.appendChild(button);
        document.body.appendChild(a);

        button.click();
        setTimeout(function () {
            document.body.removeChild(a);
        }, 1000);
    },
    getVal: function (obj, o) {
        return obj && obj[o] || null;

    },
    getKey: function (obj, o) {
        var val = null;
        for (var a in obj) {
            if (obj.hasOwnProperty(a)) {
                if (obj[a] === o) {
                    val = a;
                    break;
                }
            }
        }
        return val;
    }, createCode1: function (val, code, cb,fcb) {
        return new KinerCode({
            len: 4,//需要产生的验证码长度
//        chars: ["1+2","3+15","6*8","8/4","22-15"],//问题模式:指定产生验证码的词典，若不给或数组长度为0则试用默认字典
            chars: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 0,
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
            ],//经典模式:指定产生验证码的词典，若不给或数组长度为0则试用默认字典
            question: false,//若给定词典为算数题，则此项必须选择true,程序将自动计算出结果进行校验【若选择此项，则可不配置len属性】,若选择经典模式，必须选择false
            copy: false,//是否允许复制产生的验证码
            bgColor: "",//背景颜色[与背景图任选其一设置]
            bgImg: "",//若选择背景图片，则背景颜色失效
            randomBg: false,//若选true则采用随机背景颜色，此时设置的bgImg和bgColor将失效
            inputArea: val,//输入验证码的input对象绑定【 HTMLInputElement 】
            codeArea: code,//验证码放置的区域【HTMLDivElement 】
            click2refresh: true,//是否点击验证码刷新验证码
            false2refresh: true,//在填错验证码后是否刷新验证码
            validateEven: "",//触发验证的方法名，如click，blur等
            validateFn: function (result, code) {//验证回调函数
                if (result) {
                    cb()
                } else {
                    if (this.opt.question) {
                        fcb&&fcb('验证码错误');
                    } else {
                        fcb&&fcb('验证码错误');
                    }
                }
            }
        });
    },
    createCode2: function (val, code, cb,fcb) {
        return new KinerCode({
            len: 4,//需要产生的验证码长度
            chars: ["1+2", "3+15", "6*8", "8/4", "22-15"],//问题模式:指定产生验证码的词典，若不给或数组长度为0则试用默认字典
//        chars: [
//            1, 2, 3, 4, 5, 6, 7, 8, 9, 0,
//            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
//            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
//        ],//经典模式:指定产生验证码的词典，若不给或数组长度为0则试用默认字典
            question: true,//若给定词典为算数题，则此项必须选择true,程序将自动计算出结果进行校验【若选择此项，则可不配置len属性】,若选择经典模式，必须选择false
            copy: false,//是否允许复制产生的验证码
            bgColor: "",//背景颜色[与背景图任选其一设置]
            bgImg: "",//若选择背景图片，则背景颜色失效
            randomBg: true,//若选true则采用随机背景颜色，此时设置的bgImg和bgColor将失效
            inputArea: val,//输入验证码的input对象绑定【 HTMLInputElement 】
            codeArea: code,//验证码放置的区域【HTMLDivElement 】
            click2refresh: true,//是否点击验证码刷新验证码
            false2refresh: true,//在填错验证码后是否刷新验证码
            validateEven: "",//触发验证的方法名，如click，blur等
            validateFn: function (result, code) {//验证回调函数
                if (result) {
                    cb()
                } else {
                    if (this.opt.question) {
                        fcb&&fcb('验证码错误');
                    } else {
                        fcb&&fcb('验证码错误');
                    }
                }
            }
        });
    }
}