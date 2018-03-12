import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import Login from "./components/login/Login";

import {Form} from "antd";

import registerServiceWorker from './registerServiceWorker';

const LoginForm=Form.create()(Login);


ReactDOM.render(<LoginForm />, document.getElementById('app'));

//registerServiceWorker();
