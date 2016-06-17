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
import Drawer from 'react-native-drawer'

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
            selectedName: INDEX_API_DATA.name,
            selectedUrl: INDEX_API_DATA.url,
            drawerDisabled: false,
        };

        this.drawerOpen = false;
    }

    closeDrawer = () => {
        this._drawer.close();
        this.drawerOpen = false;
    };

    openDrawer = () => {
        this._drawer.open();
        this.drawerOpen = true;
    };

    onMenuItemSelected = (name, url, ext) => {
        this.drawerOpen = false;
        this.setState({
            selectedName: name,
            selectedUrl: url,
            selectedExt: ext,
        });
    }

    // 获取分
    render()
    {
        //const menu = <MenuPage indexAPIData={INDEX_API_DATA} onItemSelected={this.onMenuItemSelected} navigator={this.navigator} closeDrawer={this.closeDrawer} />;
        let menu = <Text>菜单...</Text>

        let show = <ListPage key={this.state.selectedUrl} apiUrl={this.state.selectedUrl} navigator={this.navigator} />

        return (
            <Drawer
                type="static"
                content={menu}
                captureGestures={false}
                tapToClose={true}
                openDrawerOffset={0.2} // 20% gap on the right side of drawer
                panCloseMask={0.2}
                tweenDuration={100}
                panThreshold={0.08}
                closedDrawerOffset={-3}
                style={styles.drawer}
                disabled={this.state.drawerDisabled}
                open={this.drawerOpen}
                ref={(ref) => this._drawer = ref}
                negotiatePan={true}
                acceptDoubleTap={true}
                panOpenMask={0.2}
            >

                <View style={styles.container}>
                    <View style={styles.topnav}>
                        <Icon name="ellipsis-v" size={24} color="#fff" onPress={this.openDrawer} style={styles.navright} />
                        <Text style={styles.navtit}>{this.state.selectedName}</Text>
                    </View>

                    <StatusBar hidden={false} backgroundColor="#0AAD5E" barStyle="light-content" />

                    {show}

                </View>

              </Drawer>
        );

        /*
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
        */
    }
}


const styles = StyleSheet.create({
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  container: {
      flex:1,
      backgroundColor: '#FAFAFA',
      flexDirection: 'column',
      paddingLeft: 3,
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
