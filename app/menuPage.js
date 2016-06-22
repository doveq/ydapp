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
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import SideMenu from 'react-native-side-menu';


const NAV_API_URL = 'http://112.124.18.75/api/get_category_index/';
const LIST_API_URL = 'http://112.124.18.75/api/get_category_posts/?exclude=content,excerpt,comments,attachments&id=';
const VALIDATE_AUTH_URL = 'http://112.124.18.75/api/user/validate_auth_cookie/?insecure=cool'

const window = Dimensions.get('window');

export default class MenuPage extends Component
{
    constructor(props)
    {
        super(props);
        this.navigator = this.props.navigator;
        this.state = {
            loaded: false,
            navData: null,
            isLogin: false,
            username: null,
        };
    }

    // 在初始化渲染执行之后立刻调用一次
    componentDidMount()
    {
        this.getNavData();
        this.auth();
    }

    // 性能优化，返回true才会调用 render() 重绘UI
    shouldComponentUpdate (nextProps = {}, nextState = {})
    {
        return true;
    }

    // 获取顶部菜单栏数据
    async getNavData()
    {
        fetch(NAV_API_URL)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    loaded: true,
                    navData: data.categories,
                });
            })
            .catch((error) => {
                console.warn(error);
            });
    }

    async auth()
    {
        // 查看用户是否已经登录
        let user = await AsyncStorage.getItem('user');
        if (user != null) {
            user = JSON.parse(user);
            this.setState({
                isLogin: true,
                username: user.username,
            });
        }
    }

    onGoto(page)
    {
        this.navigator.push({name:page});
    }

    async onLogout()
    {
        await AsyncStorage.removeItem('user');
        this.setState({
            isLogin: false,
            username: null,
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

        /*
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{ uri, }}/>
          <Text style={styles.name}>Your name</Text>
        </View>
        <Text
          onPress={() => this.props.onItemSelected('About')}
          style={styles.item}>
          About
        </Text>
        */


        let login =  <View style={styles.item} key={9998} >
                <TouchableOpacity onPress={() => this.onGoto('loginPage')} >
                <Text style={styles.itemStr}>
                    <Icon name="sign-in" size={18} color="#fff" />     {'登录'}
                </Text>
                </TouchableOpacity>
            </View>;

        let reg =  <View style={styles.item} key={9999} >
                <TouchableOpacity onPress={() => this.onGoto('registerPage')} >
                <Text style={styles.itemStr}>
                    <Icon name="user-plus" size={18} color="#fff" />    {'注册'}
                </Text>
                </TouchableOpacity>
            </View>;

        let uinfo = null;
        let logout = null;

        if (this.state.isLogin) {
            login = null;
            reg = null;
            uinfo = <View style={styles.item} key={9997} >
                      <Text style={styles.itemStr}>
                          <Icon name="user" size={18} color="#fff" />    {this.state.username}
                      </Text>
                    </View>;

            logout = <View style={styles.item} key={9996} >
                      <TouchableOpacity onPress={() => this.onLogout()} >
                      <Text style={styles.itemStr}>
                          <Icon name="sign-out" size={18} color="#fff" />    {'退出登录'}
                      </Text>
                      </TouchableOpacity>
                    </View>;
        }

        return (
            <ScrollView scrollsToTop={false} style={styles.menu}>

                <View key={9995} style={{paddingBottom:10,}}>
                    <TouchableOpacity onPress={this.props.closeDrawer} >
                        <Text style={{textAlign:"right",}}><Icon name="chevron-right" size={18} color="#fff" /></Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.item} key={0} >
                    <TouchableOpacity onPress={() => this.props.onItemSelected(this.props.indexAPIData.name, this.props.indexAPIData.url, null)} >
                    <Text style={styles.itemStr}>
                        <Icon name="ellipsis-h" size={18} color="#fff" />     {this.props.indexAPIData.name}
                    </Text>
                    </TouchableOpacity>
                </View>

                {
                    this.state.navData.map((data) => {
                        let apiUrl = LIST_API_URL + data.id;
                        return (
                            <View style={styles.item} key={data.id} >
                                <TouchableOpacity onPress={() => this.props.onItemSelected(data.title, apiUrl, null)} >
                                <Text style={styles.itemStr}>
                                    <Icon name="ellipsis-h" size={18} color="#fff" />     {data.title}
                                </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })
                }

                <View style={{marginTop:20,}}></View>

                {uinfo}
                {login}
                {reg}
                {logout}

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    backgroundColor: '#47515E',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 20,
  },
  item: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    marginLeft:10,
    marginRight:10,
    borderStyle: 'solid',
    borderBottomWidth: 0.3,
    borderBottomColor: '#626B76',
  },
  itemStr: {
      fontSize: 18,
      color:'#fff',
      textAlign:'left',
  },
});
