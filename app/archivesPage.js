/*
    文章详情页
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
  WebView,
  Platform,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

// http://112.124.18.75/wp-json/wp/v2/posts/46
var POST_API_URL = 'http://112.124.18.75/api/get_post/?exclude=excerpt,comments,attachments&id=';

var DEVICE_WIDTH = Dimensions.get('window').width;

export default class ArchivesPage extends Component
{
    constructor(props)
    {
        super(props);
        this.navigator = this.props.navigator;

        this.state = {
            loaded: false,
            data: null,
        };
    }

    // 在初始化渲染执行之后立刻调用一次
    componentDidMount()
    {
        this.getData();
    }

    // 获取顶部菜单栏数据
    async getData()
    {
        fetch(POST_API_URL + this.props.id)
            .then((response) => response.json())
            .then((data) => {

                this.setState({
                    loaded: true,
                    data: data.post,
                });
            })
            .catch((error) => {
                Alert.alert('', error.message);
            });
    }

    // 获取分
    render()
    {
        if (!this.state.loaded) {
            return (
              <View style={{flex:1, justifyContent: 'center', alignItems: 'center',}}>
                  <Text style={{fontSize: 18, textAlign: 'center',}} ><Icon name="paper-plane-o" size={20} /> 正在努力加载</Text>
              </View>
            );
        }

        let data = this.state.data;
        let topimg = '';
        if (data.thumbnail_images != null)
            topimg = '<img src="' + data.thumbnail_images.full.url + '" style="max-width:100%;">';

        let html = '<!DOCTYPE html><html><head>'
                    +'<style>html,body{padding:0,margin:0} p{font-size:2.5em;}</style>'
                    +'</head><body>'
                    + topimg
                    + '<div style="padding:20px 0;font-weight:bold;font-size:4em;">'+ data.title +'</div>'
                    + data.content
                    + '</body></html>';

        // 正则替换图片，解决图片超出显示的问题
        html = html.replace(/<\s*img\s+[^>]*?src\s*=\s*(\'|\")(.*?)\1[^>]*?\/?\s*>/g, '<img src="$2" style="width:100%;">');

        let sbar = <StatusBar hidden={false} backgroundColor="#0AAD5E" barStyle="light-content" />
        if (Platform.OS === 'ios') {
          sbar = <StatusBar hidden={true} backgroundColor="#0AAD5E" barStyle="light-content" />
        }

        return (
            <View style={styles.container}>
                {sbar}

                <View style={styles.topnav}>
                    <Icon name="chevron-left" size={24} color="#fff" onPress={() => this.navigator.pop()} style={styles.navleft} />
                    <Icon name="commenting" size={24} color="#fff" style={styles.navright} onPress={() => this.navigator.push({name:'commentPage',params:{postId:this.props.id} })} />
                </View>

                <WebView
                  automaticallyAdjustContentInsets={false}
                  contentInset={{top:0,left:0,bottom:0,right:0}}
                  style={styles.webView}
                  source={{html: html}}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  decelerationRate="normal"
                  scalesPageToFit={true}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#FAFAFA',
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
  webView:{
      padding: 0,
      margin: 0,
  }
});
