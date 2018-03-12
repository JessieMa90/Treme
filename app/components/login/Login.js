/**
 * Created with JetBrains WebStorm
 * User:jessie
 * Data:2017/12/15
 * Time:17:09
 *
 */

import React, {Component} from "react";

import "./Login.css";

import {Button, Checkbox, Form, Icon, Input, message} from "antd";

import httpUtil from "../../utils/httpUtil";
import util from "../../utils/util";
import appConfig from "../../global/appConfig";
const FormItem = Form.Item;
class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            password: ""
        };

        this._cookieRememberName = appConfig.cookiesName.remember;
        this._cookieUserName = appConfig.cookiesName.user;
    }

    componentDidMount() {
        const data = util.getCookie(this._cookieRememberName);
        if (data) {
            try {
                const {userName, password} = JSON.parse(data);
                this.setState({
                    userName,
                    password
                });
            }
            catch (e) {

            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.loginApp(values);
            }
        });
    }

    loginApp(values) {
        const userName = values.userName;
        const data = {
            userName: userName,
            password: values.password
        };
        if (values.remember) {//保存
            util.setCookie(this._cookieRememberName, JSON.stringify(data), 2);
        }
        httpUtil.post('/login', data).then(response => {
            if (!response.success) {
                message.warn(userName + "登录失败")
            } else {
                message.success(userName + "登录成功");
                util.setCookie(this._cookieUserName, JSON.stringify(response.result));
                window.location.href = 'index.html';
            }
        })
    }

    handleInputChange(e, attr) {
        const value = e.target.value;
        let obj = {};
        obj[attr] = value;
        this.setState(obj);
    }

    render() {
        const {userName, password} = this.state;
        const {getFieldDecorator} = this.props.form;
        return (<div className="login-root">
            <div className="login-form">
                <div className="welcome-msg">癌战</div>
                <Form onSubmit={e =>
                    this.handleSubmit(e)}>
                    <FormItem>
                        {getFieldDecorator('userName', {
                            initialValue: userName,
                            rules: [{required: true, message: '请输入用户名!'}],
                        })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                   placeholder="用户名"
                                   onChange={e => {
                                       this.handleInputChange(e, "userName");
                                   }}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: '请输入密码!'}],
                            initialValue: password,
                        })(
                            <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                   type="password"
                                   placeholder="密码"
                                   onChange={e => {
                                       this.handleInputChange(e, "userName");
                                   }}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>记住我</Checkbox>
                        )}
                        <a className="login-form-forgot" href="">忘记密码</a>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登陆
                        </Button>
                        或者 <a href="">去注册!</a>
                    </FormItem>
                </Form>
            </div>
        </div>);
    }
}

export default LoginForm;