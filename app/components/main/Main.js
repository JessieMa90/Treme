/**
 * Created with JetBrains WebStorm
 * User:jessie
 * Data:2017/12/15
 * Time:16:01
 *
 */
import React, {Component} from "react";
import "./Main.css";
import {Icon, Layout, Menu} from "antd";

const {Header, Content, Sider} = Layout;
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKey: "1"
        }
    }


    changeSelectedKey(selectedKey) {
        this.setState({
            selectedKey
        });
    }

    render() {
        const {selectedKey} = this.state;
        return (<div className="main">
            <Layout className="top">
                <Header className="header">
                    <div className="logo">
                        <img src="./resource/image/logo.png"/>
                        <span>Test</span>
                    </div>
                </Header>
            </Layout>
            <Layout className="left">
                <Sider>
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={[selectedKey]}
                        onClick={({key}) => {
                            this.changeSelectedKey(key)
                        }
                        }
                        mode="inline"
                    >
                        <Menu.Item
                            key="1">
                            <Icon type="inbox"/>
                            <span>Test1</span>

                        </Menu.Item>
                        <Menu.Item
                            key="2">
                            <Icon type="global"/>
                            <span>Test2</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Content>
                <div>主要内容区</div>
                </Content>
            </Layout>
        </div>);
    }
}

export  default  Main;