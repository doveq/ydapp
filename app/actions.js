/**
 * redux 动作处理
 * Created by ql on 2016/6/15.
 */

'use strict';

import {
    Alert,
} from 'react-native';

import * as TYPES from './configs/types';
import * as CONFIGS from './configs/configs';

/**
 *  获取文章列表数据
 *  var int page 显示页数
 */
export function getArticleList(url, page = 1)
{
    return (dispatch, getState) => {
        dispatch({'type': TYPES.ARTICLE_LIST_DOING});

        url = url + '&page=' + page;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                let state = getState();
                console.log(state);

                let isMore = true;
                if (data.pages <= page) {
                    isMore = false;
                }

                let posts = data.posts;

                // 如果以前有数据则合并数据，加载更多时用到
                //if (this.state.listData != null) {
                //    posts = this.state.listData.concat(posts);
                //}

                dispatch({'type': TYPES.ARTICLE_LIST_OK, 'data': posts, 'isMore': isMore});
            })
            .catch((error) => {
                dispatch({'type': TYPES.ARTICLE_LIST_ERROR});
                Alert.alert('', error.message)
            });
    }
}