/*
    启动图片展示页面
*/

'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';

import ListPage from "./listPage";

var NAV_API_URL = 'http://112.124.18.75/wp-json/wp/v2/categories?exclude=1';
var LIST_API_URL = 'http://112.124.18.75/wp-json/wp/v2/posts?context=embed&categories=';

export default class MainPage extends Component
{
    constructor(props)
    {
        super(props);
        this.navigator = this.props.navigator;
        this.state = {
            loaded: false,
            navData: null,
        };
    }

    // 在初始化渲染执行之后立刻调用一次
    componentDidMount()
    {
        this.getNavData();
    }

    // 获取顶部菜单栏数据
    getNavData()
    {
        fetch(NAV_API_URL)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    loaded: true,
                    navData: data,
                });
            })
            .catch((error) => {
                console.warn(error);
            });
    }

    // 获取分
    render()
    {
        if (!this.state.loaded) {
            return (
              <View style={{flex:1, justifyContent: 'center', alignItems: 'center',}}>
                  <StatusBar hidden={false} backgroundColor="#0AAD5E" barStyle="light-content" />
                  <Text style={{fontSize: 18, textAlign: 'center',}} ><Icon name="paper-plane-o" size={20} />  正在努力加载 </Text>
              </View>
            );
        }

        return (
            <View style={styles.container}>
                <StatusBar hidden={false} backgroundColor="#0AAD5E" barStyle="light-content" />
                <ScrollableTabView
                    renderTabBar={() => <ScrollableTabBar />}
                    scrollWithoutAnimation = {true}
                    tabBarBackgroundColor={'#0AAD5E'}
                    tabBarInactiveTextColor={'white'}
                    tabBarActiveTextColor={'white'}
                    tabBarUnderlineColor={'white'}
                    tabBarTextStyle={{fontSize:16}}
                    initialPage={0} >
                        {
                          this.state.navData.map((data) => {
                              let apiUrl = LIST_API_URL + data.id;
                              return <View style={styles.view} tabLabel={data.name} key={'nav' + data.id}><ListPage id={data.id} apiUrl={apiUrl} navigator={this.navigator} /></View>;
                          })
                        }

                </ScrollableTabView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
  container: {
      flex:1,
      backgroundColor: '#FAFAFA',
  },
  view: {
      flex:1,
      backgroundColor: '#FAFAFA',
  }
});
