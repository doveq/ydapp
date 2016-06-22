/*
    启动图片展示页面
*/

'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  AsyncStorage,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class LoginPage extends Component
{
    constructor(props)
    {
        super(props);
        this.navigator = this.props.navigator;

        this.state = {
            name: '',
            passwd: '',
            isSubmit: false,
        };
    }

    onLogin()
    {
        if (this.state.name.length <= 0) {
            Alert.alert(
                '请填写用户名',
                null,
                [{text: '确定'},]);
        } else if (this.state.passwd.length == 0) {
            Alert.alert(
                '请填写密码',
                null,
                [{text: '确定'},]);
        } else if (this.state.passwd.length < 6) {
            Alert.alert(
                '密码不能小于6位数',
                null,
                [{text: '确定'},]);
        } else {

            this.setState({ isSubmit:true, });

            let url = 'http://112.124.18.75/api/user/generate_auth_cookie/?insecure=cool'
                        +'&seconds=31536000'
                        +'&username='+ this.state.name
                        +'&password='+ this.state.passwd;

            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    this.setState({ isSubmit:false, });

                    if (data.status == 'ok') {
                        let info = {uid:data.user.id, cookie:data.cookie, username:data.user.username, displayname:data.user.displayname, email:data.user.email};
                        AsyncStorage.setItem('user', JSON.stringify(info)).done(() => this.navigator.push({name:'mainPage'}) );
                    } else {
                        Alert.alert(
                            "错误的用户名或密码",
                            null,
                            [{text: '确定'},]);
                    }
                })
                .catch((error) => {
                    console.warn(error);
                    this.setState({ isSubmit:false, });
                });
        }
    }

    render()
    {

        let btn = null;

        // 如果正在提交数据
        if (this.state.isSubmit) {
            btn = <View style={{backgroundColor: '#e6e6e6',borderRadius:5, padding:10, marginTop:10,marginLeft:20,marginRight:20,}}>
                    <Text style={{fontSize:18, textAlign:'center', color:'#fff',}}>正在登录...</Text>
                    </View>;
        } else {
            btn = <View style={{backgroundColor: '#0AAD5E',borderRadius:5, padding:10,marginTop:10,marginLeft:20,marginRight:20,}}>
                        <TouchableOpacity onPress={() => this.onLogin()} >
                        <Text style={{fontSize:18, textAlign:'center', color:'#fff',}}>登录</Text>
                        </TouchableOpacity>
                  </View>;
        }

        return (
            <View style={styles.container}>
                <View style={styles.topnav}>
                    <Icon name="chevron-left" size={24} color="#fff" onPress={() => this.navigator.pop()} style={styles.navleft} />
                    <Text style={styles.navtit}></Text>
                </View>

                <View style={styles.item}>
                    <TextInput
                        style={{height: 40, borderColor: '#0AAD5E', borderWidth: 1}}
                        placeholder='用户名'
                        onChangeText={(text) => this.setState({name: text})}
                        value={this.state.name}
                        autoCapitalize='none'
                        maxLength={12}
                    />
                </View>
                <View style={styles.item}>
                    <TextInput
                        style={{height: 40, borderColor: '#0AAD5E', borderWidth: 1}}
                        placeholder='登录密码'
                        onChangeText={(text) => this.setState({passwd: text})}
                        value={this.state.passwd}
                        autoCapitalize='none'
                        maxLength={32}
                        secureTextEntry={true}
                    />
                </View>

                {btn}

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    item: {
        padding: 20,
    },
    tit: {
        textAlign: 'left',
    },
    topnav: {
        backgroundColor: '#0AAD5E',
        height:48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navleft: {
        position: 'absolute',
        left:15,
        top: 12,
    },
    navright: {
      position: 'absolute',
      right:15,
      top: 12,
    },
    navtit: {
        flex:1,
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        marginTop:10,
    },
});
