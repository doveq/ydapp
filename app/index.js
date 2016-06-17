/**
 * redux 和 react-native 结合起来
 * Created by ql on 2016/6/17.
 */

import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';

import {
    AppRegistry,
} from 'react-native';

import configureStore from './redux/stores'
import App from './app'

const store = configureStore();

export default class index extends Component
{
    render()
    {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        )
    }
}

AppRegistry.registerComponent('ydapp', () => index);