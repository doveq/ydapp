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

var NAV_TITLE = '能源评论';

// 轮播图数据地址
var SLIDE_API_URL = 'http://118.26.146.66:8080/api/data.php?type=slide';

// 文章列表数据地址
var POSTS_API_URL = 'http://118.26.146.66:8080/api/data.php?type=list';


// 屏幕宽度
var DEVICE_WIDTH = Dimensions.get('window').width;


var ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

var vpds = new ViewPager.DataSource({
    pageHasChanged: (p1, p2) => p1 !== p2,
});

export default class IndexPage extends Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            slideLoading: false,
            postsLoading: false,
            slideLoaded: false,
            postsLoaded: false,
            isRefreshing: false,
            postsData: null,
            slideData: null,
        };
    }

    componentDidMount()
    {
        this.init();
    }


    /*
        初始化
    */
    init()
    {
        this.getSlideDate();
        this.getPostsData();
    }

    /*
        获取轮播图数据
    */
    async getSlideDate()
    {
        if (this.state.slideLoading)
            return;

        this.setState({slideLoading: true});

        fetch(SLIDE_API_URL)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    slideLoading: false,
                    slideLoaded: true,
                    slideData: data,
                });
            })
            .catch((error) => {
                console.warn(error);
            });
    }


    /*
        获取文章列表数据
    */
    async getPostsData()
    {
        if (this.state.postsLoading)
            return;

        this.setState({postsLoading: true});

        fetch(POSTS_API_URL)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    postsLoading: false,
                    postsLoaded: true,
                    postsData: data,
                });
            })
            .catch((error) => {
                console.warn(error);
                Alert.alert('', '加载数据失败，请下拉刷新重试');
            });
    }


    /*
        显示列表组件
    */
    renderList(data, rowID)
    {
        // 如果渲染文章列表
        return (
            <TouchableOpacity onPress={this._onPressButton}>
                <View style={styles.postItem}>
                    <Image
                      source={{uri: data.image}}
                      style={styles.thumbnail}
                    />
                    <Text style={styles.postTit}>{data.title}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    /*
        渲染轮播图显示
    */
    renderViewPager(data, pageID)
    {
        return (
            <View style={{flex: 1, height: 200}}>
                <ViewPager
                    style={{flex:1}}
                    dataSource={vpds.cloneWithPages(this.state.slideData)}
                    renderPage={this.renderVPimg}
                    isLoop={true}
                    autoPlay={true} />
            </View>
        );
    }

    renderVPimg(data, pageID)
    {
        return (
          <Image
            style={styles.viewPagerImg}
            source={{uri: data.image}} />
        );
    }


    // 进入详情页
    navHandleChange(data)
    {

    }



    render()
    {
        if (!this.state.postsLoaded && !this.state.slideLoaded) {
            return (
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center',}}>
                    <Text style={{fontSize: 20, textAlign: 'center',}} >加载中...</Text>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <ListView style={{flex:1}}
                    dataSource={ds.cloneWithRows(this.state.postsData)} // 渲染的数据聚合
                    renderRow={this.renderList.bind(this)}
                    renderHeader={this.renderViewPager.bind(this)}

                    refreshControl={
                          <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.getPostsData.bind(this)}
                            title="loading..."
                          />
                      }
                />
            </View>
        );
    }

}//:~

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  postItem: {
    backgroundColor: 'red',
  },
  postTit: {
    position: 'absolute',
    color: '#fff',
    textAlign: 'left',
    bottom: 30,
    left:20,
  },
  thumbnail: {
     width: DEVICE_WIDTH,
     height: (DEVICE_WIDTH * 2/3),
     backgroundColor: 'blue',
  },
  viewPagerImg: {
      width: DEVICE_WIDTH,
      height: 200,
  },
});
