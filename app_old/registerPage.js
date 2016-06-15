/*
    注册页面
*/

'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  AsyncStorage,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class RegisterPage extends Component
{
    constructor(props)
    {
        super(props);
        this.navigator = this.props.navigator;

        this.state = {
            name: '',
            email: '',
            passwd: '',
            repasswd: '',
            isSubmit: false,
        };

    }

    // 在初始化渲染执行之后立刻调用一次
    componentDidMount()
    {

    }

    onReg()
    {
        if (this.state.name.length <= 0) {
            Alert.alert(
                '请填写用户名',
                null,
                [{text: '确定'},]);
        } else if ( !(/^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/.test(this.state.email)) ) {
            Alert.alert(
                '请填写正确的邮箱地址',
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
        } else if (this.state.passwd !== this.state.repasswd) {
            Alert.alert(
                '重复密码不正确',
                null,
                [{text: '确定'},]);
        } else {
            this.reguer();
        }

    }

    reguer()
    {
        this.setState({ isSubmit:true });

        // 获取注册时用到的随机数
        fetch('http://112.124.18.75/api/get_nonce/?insecure=cool&controller=user&method=register')
            .then((response) => response.json())
            .then((data) => {

                // 31536000 设置一年的过期时间
                let reg = "http://112.124.18.75/api/user/register/?insecure=cool"
                            +"&username="+ this.state.name
                            +"&display_name="+ this.state.name
                            +"&email="+ this.state.email
                            +"&user_pass="+ this.state.passwd
                            +"&nonce="+ data.nonce
                            +"&seconds=31536000";

                fetch(reg)
                    .then((response) => response.json())
                    .then((data) => {
                        this.setState({ isSubmit:false, });

                        if (data.status == 'error') {
                            Alert.alert(
                                '注册失败',
                                data.error,
                                [{text: '确定'},]);
                        } else {
                            // 注册成功保存登入信息
                            let info = {uid:data.user_id, cookie:data.cookie, username:this.state.name, displayname:this.state.name, email:this.state.email};
                            AsyncStorage.setItem('user', JSON.stringify(info)).done(()=> this.navigator.push({name:'mainPage'}));
                        }
                    })
                    .catch((error) => {
                        this.setState({ isSubmit:false, });
                        console.warn(error);
                    });

            })
            .catch((error) => {
                this.setState({ isSubmit:false, });
                console.warn(error);
            });


    }


    render()
    {

        let btn = null;
        // 如果正在提交数据
        if (this.state.isSubmit) {
            btn = <View style={{backgroundColor: '#e6e6e6',borderRadius:5, padding:10, marginTop:10,marginLeft:20,marginRight:20,}}>
                    <Text style={{fontSize:18, textAlign:'center', color:'#fff',}}>正在注册...</Text>
                    </View>;
        } else {
            btn = <View style={{backgroundColor: '#0AAD5E',borderRadius:5, padding:10, marginTop:10,marginLeft:20,marginRight:20,}}>
                    <TouchableOpacity onPress={() => this.onReg()} >
                    <Text style={{fontSize:18, textAlign:'center', color:'#fff',}}>注册</Text>
                    </TouchableOpacity>
                  </View>;
        }


        return (
            <ScrollView scrollsToTop={false} style={styles.container}>
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
                        placeholder='邮箱地址'
                        onChangeText={(text) => this.setState({email: text})}
                        value={this.state.email}
                        autoCapitalize='none'
                        keyboardType='email-address'
                        maxLength={32}
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

                <View style={styles.item}>
                    <TextInput
                        style={{height: 40, borderColor: '#0AAD5E', borderWidth: 1}}
                        placeholder='重复密码'
                        onChangeText={(text) => this.setState({repasswd: text})}
                        value={this.state.repasswd}
                        autoCapitalize='none'
                        maxLength={32}
                        secureTextEntry={true}
                    />
                </View>

                {btn}

            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    item: {
        padding:20,
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
