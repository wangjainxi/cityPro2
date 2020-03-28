import request from '@/utils/request';
import oboe from 'oboe';
import axios from 'axios';
import { formatParam } from '@/utils/tools';
export const getIconGateWayList = async(params) => {
  console.log(' api getIconGateWayList  params', params);
  const paramsStr = formatParam(params);
  const url = `api/tenant/devices?${paramsStr}`;
  const res = await request({
    url,
    method: 'get'
  });
  return res;
};

export const getTreeList = async (netId) => {

  const res = request({
    url: `/api/conf/gateways/${netId}/devices`,
    method: 'get'
  });
  return res;
};

// 新建设备
export function createNet(params) {
  return request.post(
    `/api/devices`,
    params
  );
}

// 删除设备
export function deleteNet(deviceId) {
  return request.delete(
    `/api/devices/${deviceId}`,
    { deviceId }
  );
}
// 获取设备访问token
export function getCredentials(deviceId) {
  return request({
    url: `/api/devices/${deviceId}/credentials`,
    method: 'get'
  });
}

// 获取网关属性列表
export function getAttr(params) {
  return request({
    url: `/api/plugins/telemetry/${params.entityType}/${params.entityId}/attributes/${params.scope_1}?keys=${params.key}`,
    method: 'get'
  });
}

// 保存网关属性
export const saveNetAttr = async(params) => {
  const res = await request.post(
    `/api/plugins/telemetry/DEVICE/${params.deviceId}/attributes/${params.scope}`,
    params.data
  );
  return res;
};

// 下发配置
export const sendCommand = async(params) => {
  const res = await request.post(
    `/api/devices/${params.deviceId}/action`,
    params,
    { timeout: 15000 },
  );
  return res;
};

export const getProduct = async(productId) => {
  const res = request({
    // 获取固件列表  》 get url:  /api/conf/products/{productId}/firmwares
    url: `/api/conf/products/${productId}/firmwares`,
    method: 'get'
  });
  return res;
};

export function getChannelProtocol(gatewayId) {
  return request({
    url: `/api/conf/transport/protocols`,
    method: 'get'
  });
}

export const getTopicData = async (gatewayId) => {
  const res = await request({
    url: `/api/conf/gateways/${gatewayId}/topics`,
    method: 'get'
  });
  return res;
};

export const logTailf = async (query, callback) => {
  const url = `http://cloud.moonstart.cn/api/logs`;
  const res = await oboe({
    url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: query,
    withCredentials: true
  }).done(function(things) {
    callback(things);
  });
  return res;
};

export function downloadLog(query) {
  return axios({
    url: `http://cloud.moonstart.cn/api/logs/txt`,
    method: 'post',
    data: query,
    responseType: 'blob'
  });
}

export function getAttachment(blobId, callback) {
}

export const stateEventTrace = async (query, callback) => {
  const url = `/api/devices/state?deviceIds=${query}`;
  const token = 'Bearer ' + localStorage.getItem('token');

  const res = await oboe({
    url,
    method: 'get',
    headers: {
      'x-Authorization': token
    }
  }).done(function(things) {
    callback(things);
  });
  return res;
};

export const getEvents = async (params) => {

  const res = await request({
    url: `/api/events/DEVICE/${params.entityId}`,
    method: 'get',
    params
  });
  return res;
};

/**
 * 运行监控
 */

export const totalStatus = async({ entityType, entityId }) => {
  const res = await request({
    url: `/api/telemetry/${entityType}/${entityId}/statistics`,
    method: 'get'
  });
  return res;
};

export const fetchChartData = async({ entityType, entityId, params }) => {
  const paramsStr = formatParam(params);
  const res = await request({
    url: `/api/plugins/telemetry/${entityType}/${entityId}/values/timeseries?${paramsStr}`,
    method: 'get'
  });
  return res;
};

export const fetchProcessData = async({ entityType, entityId, params }) => {
  const paramsStr = formatParam(params);
  const res = await request({
    url: `/api/plugins/telemetry/${entityType}/${entityId}/values/timeseries?${paramsStr}`,
    method: 'get'
  });
  return res;
};

