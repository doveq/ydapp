/**
*  首页
*/

'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  ListView,
  RefreshControl,
  Dimensions,
  Platform,
  TouchableOpacity,
  AsyncStorage,
  Alert,
} from 'react-native';

import ViewPager from 'react-native-viewpager';
import Icon from 'react-native-vector-icons/FontAwesome';

// 屏幕宽度
var DEVICE_WIDTH = Dimensions.get('window').width;

var ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

export default class ListPage extends Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            loaded: false,
            listData: null,
            isLoading: false,
        };

        // api接口地址
        this.apiUrl = this.props.apiUrl;
        this.navigator = this.props.navigator;
        // 保存上次组件刷新的URL，判断是否需要重新下载数据
        this.preUrl = this.props.apiUrl;
        this.page = 1;
        // 判断是否有更多的数据
        this.isMore = true;
    }

    componentDidMount()
    {
        this.getListData();
    }

    componentWillReceiveProps()
    {
        // 组件属性刷新时，如果访问的URL是以前的地址则不下载数据
        if (this.preUrl != this.props.apiUrl) {
            this.preUrl = this.props.apiUrl;
            this.apiUrl = this.props.apiUrl;

            /*
                设置listData: null,是解决访问其他分类时会跟上一个分类数据叠加的问题，
                因为fetch中使用了this.state.listData.concat(data) 数据合并
            */
            this.setState({
                loaded: false,
                listData: null,
            });

            this.isMore = true;
            this.page = 1;
            this.getListData();
        }
    }

    // 性能优化，返回true才会调用 render() 重绘UI
    shouldComponentUpdate (nextProps = {}, nextState = {})
    {
        return true;
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

        this.getListData();
    }

    async getListData()
    {
        let url = this.apiUrl + '&page=' + this.page;
        
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (data.pages <= this.page) {
                    this.isMore = false;
                }

                let posts = data.posts;

                // 如果以前有数据则合并数据，加载更多时用到
                if (this.state.listData != null) {
                    posts = this.state.listData.concat(posts);
                }

                this.setState({
                    loaded: true,
                    listData: posts,
                    isLoading: false,
                });
            })
            .catch((error) => {
                Alert.alert('', error.message);
            });
    }

    /*
        显示列表组件
    */
    renderList(data, rowID)
    {
        // 如果设置了特殊图片,则按图片显示
        if (data.thumbnail_images != null) {
            return (
                <View style={styles.imgItem} key={data.id} >
                    <TouchableOpacity onPress={() => this.onPostButton(data.id)} >
                    <Image
                        resizeMode={'cover'}
                        source={{uri:data.thumbnail_images.full.url}}
                        style={styles.imgItemThumb}/>

                    <Text style={styles.imgItemTit} numberOfLines={28} >{data.title}</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            // 按标题显示
            return (
                <View style={styles.strItem} key={data.id}>
                    <TouchableOpacity onPress={() => this.onPostButton(data.id)} >
                    <Text key={'post' + data.id} style={styles.strItemTit} numberOfLines={28}>{data.title}</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    // 进入详情页
    onPostButton(id)
    {
        this.navigator.push({
            name: 'archivesPage',
            params: {id: id},
        });
    }


    render()
    {
        if (!this.state.loaded) {
            return (
              <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA',}}>
                  <Text style={{fontSize: 18, textAlign: 'center',}} ><Icon name="paper-plane-o" size={20} />  正在努力加载 </Text>
              </View>
            );
        }

        if(this.state.listData == undefined || this.state.listData.length == 0) {
            return (
              <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA',}}>
                  <Text style={{fontSize: 20, textAlign: 'center',}} >暂无文章</Text>
              </View>
            );
        } else {
            return (
                <ListView style={{flex:1, backgroundColor: '#FAFAFA',}}
                    key={'list' + this.props.id}
                    dataSource={ds.cloneWithRows(this.state.listData)} // 渲染的数据聚合
                    renderRow={this.renderList.bind(this)}
                    keyboardDismissMode={'none', 'ondrag','interactive'}
                    keyboardShouldPersistTaps={true}
                    initialListSize={5}
                    onEndReached={this.onEndReached.bind(this)}
                    onEndReachedThreshold={30}
                    removeClippedSubviews={true}
                />
            );
        }
    }

}//:~

var styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#FAFAFA',
  },
  imgItem: {

  },
  imgItemThumb: {
      width: DEVICE_WIDTH,
      height: 200,
  },
  imgItemTit: {
      position: 'absolute',
      color: '#fff',
      textAlign: 'center',
      bottom: 20,
      left:15,
      right:15,
      fontSize: 18,
      fontWeight: "600",
      backgroundColor: 'transparent',
  },
  strItem: {
      borderStyle: 'solid',
      borderBottomWidth: 0.3,
      borderBottomColor: '#CECECE',
      flex: 1,
      justifyContent: 'center',
      height: 70,
      paddingLeft: 15,
      paddingRight: 15,
  },
  strItemTit: {
      textAlign: 'left',
      fontSize: 16,
      fontWeight: "400",
      color: '#333333',
  },
});
