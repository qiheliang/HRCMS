'use strict';

import axios from 'axios';
import api from '../providers/api';

axios.interceptors.request.use(
  config => {
    // loading
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.resolve(error.response);
  }
);

function checkStatus(response) {
  // loading
  // 如果状态码正常，这直接返回数据
  if (
    response &&
    (response.status === 200 ||
      response.status === 304 ||
      response.status === 400)
  ) {
    return response.data;
    // 如果不需要data以外的数据直接return response.data
  }
  // 异常状态下，把错误信息返回出去
  let str = '';
  if (!response) {
    str = '';
  } else {
    str = !response.status ? '' : response.status;
  }
  return {
    data: {
      status: str,
      msg: '网络异常'
    }
  };
}

function checkCode(res) {
  // 如果code异常（这里已经包括网络错误，服务器错误，后端抛出错误），可以弹出一个错误提示，告诉用户
  if (res.error === 'error') {
    alert('请求超时');
  }
  return res;
}

export default {
  post(url, data, callback = function() {}) {
    return axios({
      method: 'post',
      baseURI: api.domain, // QA Server
      url: api.domain + url,
      data: data,
      withCredentials: true,
      onUploadProgress: function(progressEvent) {
        if (progressEvent) {
          callback(progressEvent);
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      }
    })
      .then(response => {
        return checkStatus(response);
      })
      .then(res => {
        return checkCode(res);
      });
  },
  get(url, params) {
    return axios({
      method: 'get',
      baseURI: api.domain, // QA Server
      url: api.domain + url,
      params,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(response => {
        return checkStatus(response);
      })
      .then(res => {
        return checkCode(res);
      });
  }
};
