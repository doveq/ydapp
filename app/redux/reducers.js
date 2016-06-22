/**
 * 统一处理 redux reducer 处理
 * Created by ql on 2016/6/16.
 */

'use strict';

import {combineReducers} from 'redux';
import * as TYPES from '../configs/types';

const initialState = {}

export function articleList(state = initialState, action)
{
    switch (action.type) {
        case TYPES.ARTICLE_LIST_DOING:
            state[action.url] = {...state[action.url], loading: true};
            return Object.assign({}, state);
        case TYPES.ARTICLE_LIST_OK:
            state[action.url] = {...state[action.url], loading: false, loaded: true, data: action.data, isMore: action.isMore};
            return Object.assign({}, state);
        case TYPES.ARTICLE_LIST_ERROR:
            state[action.url] = {...state[action.url], loading: false, loaded: true,};
            return Object.assign({}, state);
        default:
            return state;
    }
}


const rootReducer = combineReducers({
    articleList,
});

export default rootReducer;