/**
 * 统一处理 redux reducer 处理
 * Created by ql on 2016/6/16.
 */

'use strict';

import {combineReducers} from 'redux';
import * as TYPES from './../configs/types';

const initialState = {
    loading: false,
    loaded: false,
}

export function articleList(state = initialState, action)
{
    switch (action.type) {
        case TYPES.ARTICLE_LIST_DOING:
            return Object.assign({}, state, {
                loading: true
            });
        case TYPES.ARTICLE_LIST_OK:
            let nv = {loading: false, loaded: true,};
            nv[action.url] = {data: action.data, isMore: action.isMore};

            return Object.assign({}, state, nv);
        case TYPES.ARTICLE_LIST_ERROR:
            return Object.assign({}, state, {
                loading: false,
                loaded: true,
            });
        default:
            return state;
    }
}


const rootReducer = combineReducers({
    articleList,
});

export default rootReducer;