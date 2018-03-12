/**
 * Created with JetBrains WebStorm
 * User:jessie
 * Data:2018/1/2
 * Time:14:41
 *
 */
import httpUtil from "./httpUtil";
import {message} from "antd";
import appConfig from "../global/appConfig";
export default{
    httpPost: function (data, url) {
        return httpUtil.post(url || appConfig.handlerUrl, data).then(res => {
            return res;
        });
    }
}