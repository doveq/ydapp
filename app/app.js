/**
 * App启动页面
 * @flow
 */
 'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator,
  BackAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';

// 载入各个页面设置路由
import StartPage from "./startPage";
import MainPage from "./mainPage";
import ArchivesPage from "./archivesPage";
import RegisterPage from "./registerPage";
import LoginPage from "./loginPage";
import CommentPage from "./commentPage";

export default class App extends Component
{
    constructor(props)
    {
        super(props);

        // 需要注意的是，不论是bind还是箭头函数，每次被执行都返回的是一个新的函数引用，因此如果你还需要函数的引用去做一些别的事情（譬如卸载监听器），那么你必须自己保存这个引用
        this._onBackAndroid = this.onBackAndroid.bind(this);
    }

    componentWillMount()
    {
        // 监听安卓的返回按键
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this._onBackAndroid);
        }
    }

    componentWillUnmount()
    {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this._onBackAndroid);
        }
    }

    onBackAndroid()
    {
        // 在Navigator里使用了ref属性，所以可以取到 this.navigator
        let nav = this.navigator;
        let routers = nav.getCurrentRoutes();

        //console.log( routers[routers.length - 1] );
        if (routers.length > 1 && routers[routers.length - 1].name != 'mainPage') {
            nav.pop();
            return true;
        }

        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            return false;
        }

        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出', ToastAndroid.SHORT);
        return true;
    }

    // 根据路由跳转到不同页面
    routeMap(route, navigator)
    {
        // 启动图页
        if (route.name == 'startPage') {
            return <StartPage {...route.params} navigator={navigator} />
        }

        // 框架页
        if (route.name == 'mainPage') {
            return <MainPage {...route.params} navigator={navigator} />
        }

        // 内容详情页
        if (route.name == 'archivesPage') {
            return <ArchivesPage {...route.params} navigator={navigator} />
        }

        if (route.name == 'registerPage') {
            return <RegisterPage {...route.params} navigator={navigator} />
        }

        if (route.name == 'loginPage') {
            return <LoginPage {...route.params} navigator={navigator} />
        }

        if (route.name == 'commentPage') {
            return <CommentPage {...route.params} navigator={navigator} />
        }

    }

    // 设置页面跳转动画
    routeConfigureScene(route)
    {
        // 可根据route传参数设置不同也的跳转效果
        return Navigator.SceneConfigs.FadeAndroid;
    }

    render()
    {
        return (
            <Navigator
                initialRoute={{name:'mainPage'}}
                configureScene={this.routeConfigureScene}
                renderScene={this.routeMap.bind(this)}
                ref={nav => { this.navigator = nav; }}
            />
        );
    }

}//:~


