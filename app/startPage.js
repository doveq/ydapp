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
  Animated,
  StatusBar,
} from 'react-native';

// 获取手机的宽高
const {height, width} = Dimensions.get('window');

export default class StartPage extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            bounceValue: new Animated.Value(0),
        };
    }

    // 在初始化渲染执行之后立刻调用一次
    componentDidMount()
    {
        this.state.bounceValue.setValue(1.3);     // 设置一个较大的初始值
        Animated.spring(                          // 可选的基本动画类型: spring, decay, timing
            this.state.bounceValue,                 // 将`bounceValue`值动画化
            {
                toValue: 1,                         // 将其值以动画的形式改到一个较小值
                friction: 10,
                tension: 0,
            }
        ).start( () => this.props.navigator.push({name:'mainPage'}) );    // 开始执行动画,并且执行完动画后跳转页面
    }

    render()
    {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />
                <Animated.Image
                    source={{uri:'http://112.124.18.75/app/start.jpg'}}
                    resizeMode={Image.resizeMode.cover}
                    style={{width:width, height:height,
                        transform: [                        // `transform`是一个有序数组（动画按顺序执行）
                            {scale: this.state.bounceValue},  // 将`bounceValue`赋值给 `scale`
                        ]
                    }}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});
