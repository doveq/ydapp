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

import Icon from 'react-native-vector-icons/FontAwesome';
import SideMenu from 'react-native-side-menu';

import ListPage from "./listPage";
import MenuPage from "./menuPage";

// 默认首页api接口地址
const INDEX_API_DATA = {name: '能源评论', url: 'http://112.124.18.75/api/get_recent_posts/?exclude=content,excerpt,comments,attachments'};

const window = Dimensions.get('window');

export default class MainPage extends Component
{
    constructor(props)
    {
        super(props);
        this.navigator = this.props.navigator;
        this.state = {
            isOpen: false,
            selectedName: INDEX_API_DATA.name,
            selectedUrl: INDEX_API_DATA.url,
        };
    }

    toggle() {
        console.log(this.state.isOpen);
        this.setState({
          isOpen: !this.state.isOpen,
        });
      }

      updateMenuState(isOpen) {
          this.setState({ isOpen, });
      }

      onMenuItemSelected = (name, url, ext) => {
          this.setState({
              isOpen: false,
              selectedName: name,
              selectedUrl: url,
              selectedExt: ext,
          });
      }

    // 获取分
    render()
    {
        const menu = <MenuPage indexAPIData={INDEX_API_DATA} onItemSelected={this.onMenuItemSelected} navigator={this.navigator} />;


        let show = <ListPage apiUrl={this.state.selectedUrl} navigator={this.navigator} />

        return (
            <SideMenu
                menu={menu}
                isOpen={this.state.isOpen}
                onChange={(isOpen) => this.updateMenuState(isOpen)}
                openMenuOffset={200}
                bounceBackOnOverdraw={false}
                disableGestures={false} >

                <View style={styles.container}>
                    <View style={styles.topnav}>
                        <Icon name="ellipsis-v" size={24} color="#fff" onPress={() => this.toggle()} style={styles.navleft} />
                        <Text style={styles.navtit}>{this.state.selectedName}</Text>
                    </View>

                    <StatusBar hidden={false} backgroundColor="#0AAD5E" barStyle="light-content" />

                    {show}

                </View>
            </SideMenu>
        );
    }
}


const styles = StyleSheet.create({
  container: {
      flex:1,
      backgroundColor: '#FAFAFA',
      flexDirection: 'column',
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
