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
  Dimensions,
  AsyncStorage,
  ListView,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

var ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

export default class CommentPage extends Component
{
    constructor(props)
    {
        super(props);
        this.navigator = this.props.navigator;

        this.state = {
            comment: '',
            isSubmit: false,
            loaded: false,
            listData: null,
            isLoading: false,
        };

        this.user = null;
        this.isMore = true;
        this.page = 1;
    }

    componentDidMount()
    {
        this.initUser();
        this.getComments();
    }

    // 获取登录用户信息
    async initUser()
    {
        let user = await AsyncStorage.getItem('user');
        if (user != null) {
            this.user = JSON.parse(user);
        }
    }

    // ListView组件下拉到最后后调用
    onEndReached()
    {
        if (!this.isMore || this.state.isLoading) {
            return;
        }

        this.page = this.page +1;
        this.setState({
            isLoading: true,
        });

        this.getComments();
    }

    // 获取评论数据
    async getComments()
    {
        let url = 'http://112.124.18.75/wp-json/wp/v2/comments?_envelope=1&order=desc&post='+this.props.postId+'&page=' + this.page;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.headers['X-WP-TotalPages']);

                if (data.headers['X-WP-TotalPages'] <= this.page) {
                    this.isMore = false;
                }

                let coms = data.body;

                // 如果以前有数据则合并数据，加载更多时用到
                if (this.state.listData != null) {
                    coms = this.state.listData.concat(coms);
                }

                this.setState({
                    loaded: true,
                    listData: coms,
                    isLoading: false,
                });
            })
            .catch((error) => {
                console.warn(error);
            });
    }

    renderList(data, rowID)
    {
        // 正则去掉html标签
        return (
            <View style={{padding:10,marginBottom:15,borderStyle:'solid',borderBottomWidth:0.3,borderBottomColor:'#CECECE',}} key={data.id}>
                <Text style={{fontSize:16,fontWeight:"800",}}>{data.author_name} <Icon name="commenting-o" size={20} />  <Text style={{fontSize:16,fontWeight:"400",}}>{data.content.rendered.replace(/<[^>]+>/g,"")}</Text></Text>
            </View>
        );
    }

    // 提交评论
    onSubmit()
    {
        if (this.user == null) {
            Alert.alert(
                "用户注册登录后才能发表评论",
                null,
                [{text: '确定'},]);

            return;
        }

        if (this.state.comment.length <= 0) {
            Alert.alert(
                "请填写评论内容",
                null,
                [{text: '确定'},]);

            return;
        }

        this.setState({ isSubmit:true, });

        let url = "http://112.124.18.75/api/user/post_comment/?insecure=cool&comment_status=1"
              +"&post_id=" + this.props.postId
              +"&cookie="+ this.user.cookie
              +"&content="+ this.state.comment;

        fetch(encodeURI(url))
            .then((response) => response.json())
            .then((data) => {
                this.setState({ isSubmit:false, });

                if (data.status == 'ok') {

                    // 刷新显示评论
                    this.state.listData = null;
                    this.getComments();

                    Alert.alert(
                        "评论成功",
                        null,
                        [{text: '确定'},]);
                } else {
                    Alert.alert(
                        "评论提交失败",
                        null,
                        [{text: '确定'},]);
                }
            })
            .catch((error) => {
                console.warn(error);
                this.setState({ isSubmit:false, });
            });

    }

    render()
    {
        let btn = null;
        // 如果正在提交数据
        if (this.state.isSubmit) {
            btn = <View style={{borderRadius:5,padding:5,backgroundColor:'#e6e6e6',marginTop:10,}}>
                    <Text style={{fontSize:18, textAlign:'center', color:'#fff',}}>发表评论中...</Text>
                    </View>;
        } else {
            btn = <View style={{borderRadius:5,padding:5,backgroundColor:'#0AAD5E',marginTop:10,}}>
                        <TouchableOpacity onPress={() => this.onSubmit()} >
                            <Text style={{fontSize:18, textAlign:'center', color:'#fff',}}>发表评论</Text>
                    </TouchableOpacity>
                </View>;
        }

        let list = null;
        if (this.state.loaded) {
            list = <ListView style={{flex:1, backgroundColor: '#FAFAFA',}}
                    key={'list' + this.props.id}
                    dataSource={ds.cloneWithRows(this.state.listData)} // 渲染的数据聚合
                    renderRow={this.renderList.bind(this)}
                    keyboardDismissMode={'none', 'ondrag','interactive'}
                    keyboardShouldPersistTaps={true}
                    initialListSize={10}
                    onEndReached={this.onEndReached.bind(this)}
                    onEndReachedThreshold={20}
                    enableEmptySections={true}
                />;
        } else {
            list = <Text></Text>;
        }

        return (
            <View style={styles.container}>
                <View style={styles.topnav}>
                    <Icon name="chevron-left" size={24} color="#fff" onPress={() => this.navigator.pop()} style={styles.navleft} />
                    <Text style={styles.navtit}>评论</Text>
                </View>

                <View style={{padding:10,marginBottom:20,}}>
                    <TextInput
                        style={{}}
                        placeholder='填写评论'
                        onChangeText={(text) => this.setState({comment: text})}
                        value={this.state.comment}
                        autoCapitalize='none'
                        multiline={true}
                    />
                    {btn}
                </View>

                {list}

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
        paddingTop: 20,
        paddingLeft:20,
        paddingRight:20,
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
