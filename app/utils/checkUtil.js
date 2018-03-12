/**
 * Created with JetBrains WebStorm
 * User:jessie
 * Data:2018/1/12
 * Time:9:09
 *
 */
export default{
    check: function (type, val, flag) {
        let rflag = (type === "name" ? this.isName(val) : this.isValid(type, val)) || false;
        let rel = "";
        if (!val && flag) {//如果为空,且不能为空
            rel = this.getName(type) + "不能为空";
        }
        if (val && rflag) {//如果不为空且验证正确
            rel = rflag;//返回验证信息 true||false
        }
        if (val && !rflag) {//如果不为空，且验证错误
            rel = this.isError(type);
        }
        return rel;
    },
    regexp: function (rule, val) {
        if (val) {
            let t = new RegExp(rule, 'g');
            return t.test(val);
        }
    },
    isError: function (type) {
        let infos = {
            'email': "请输入合法的邮箱",//邮箱
            'zipcode': "请输入有效的邮编",//邮编
            'telephone': "请输入正确的电话号码",//固话
            'cellphone': "请输入正确的手机号码",//手机号
            'password': "请输入合法的密码",//密码
            'realname': "请输入正确的姓名",
            'card': "请输入合法的身份证号",
            'url': "请输入有效的URL地址",
            'name': "请使用字母+数字组合",
            'test': "不能包含空格"//不能包含空格
        };
        return infos[type] || "";
    },
    getName: function (type) {
        let infos = {
            'email': "邮箱",//邮箱
            'zipcode': "邮编",//邮编
            'telephone': "电话号码",//固话
            'cellphone': "手机号码",//手机号
            'password': "密码",//密码
            'realname': "姓名",
            'card': "身份证号",
            'url': "URL地址",
            'name': "用户名"
        };
        return infos[type] || "";
    },
    isValid: function (type, val) {
        //  /pattern/正则表达式直接量
        //\w=[a-zA-Z0-9]单词  \s 空白
        //+一个或多个
        let rules = {
            'email': "^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$",//邮箱
            'zipCode': "^[1-9]{1}[0-9]{5}$",//邮编
            'telephone': "^(0[0-9]{2,3}[\-]{0,1})?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$|(^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$)",//固话
            'cellphone': "^[1]{1}[0-9]{10}$",//手机号
            'password': "^[a-zA-Z0-9]{6,20}",//密码
            // 'realname': "[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*",//汉字或英文
            'realname': "",
            // 'card': "^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{4}$|[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$",
            'card': '^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$',
            'url': "^ (https://|http://)?([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?$",
            'name': "^([a-zA-Z]{1}[a-zA-z1-9]{3,n})?([1-9]{1}[a-zA-z]{1,n}{a-zA-Z0-9}{0,n})",//字母、数字
            'ip': '^(\d+)\.(\d+)\.(\d+)\.(\d+)$',
            'test': "\\s"//不能包含空格
        };
        return this.regexp(rules[type], val);
    },
    isEmpty: function () {

    },
    //只能是英文或者数字
    isName: function (val) {
        let a = '[a-zA-Z]+';//至少包含一个
        let b = '^[a-zA-Z0-9]{6,18}$';
        return this.regexp(a, val) && this.regexp(b, val);
    },
    //只能是英文
    isEnCode: function (val) {
        let rule = "[a-zA-Z]/g";
        return this.regexp(rule, val);
    },
    //检查是否为汉字
    isCHICode: function (val) {
        let rule = '/[^\u4e00-\u9fa5]/g';
        return this.regexp(rule, val)
    },
    //检测是否为电话号码
    isTelePhone: function (val) {
        let rule = "^([0]{1,1}[1-9]{3}[-]*)*([1-9]{1,1}[0-9]{6,7}){1,1}$";
        return this.regexp(rule, val);
    },
    //是否为手机号码
    isCellPhone: function (val) {
        let rule = "^[1]{1}[\d]{10}$";
        return this.regexp(rule, val)
    },
    //是否为邮编
    isZipCode: function (val) {
        let rule = "^[1-9]{1}[\d]{5}$";
        //"^[0-9]{6}$";
        return this.regexp(rule, val);
    },
    //检测是否为邮箱
    isEmail: function (val) {
        let rule = '^(\w+@\w+){1,1}(\.\w+){1,2}$';
        // "^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
        return this.regexp(rule, val);
    },
    //是否为密码
    isPassword: function (val) {
        let rule = "^[a-zA-Z0-9_-]{6,20}$";
        return this.regexp(rule, val);
    }
}