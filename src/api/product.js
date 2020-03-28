import request from '@/utils/request';
import oboe from 'oboe';
import axios from 'axios';
import { message } from '@/utils/tools';
import { formatParam } from '@/utils/tools';
/**
 *
 * 产品相关
 */
export function getProductList(params) {
  const paramsStr = formatParam(params);
  return request({
    url: `/api/tenant/types?${paramsStr}`,
    method: 'get'
  });
}

export function createPro(params) {
  return request.post(
    '/api/types',
    params
  );
}

export function deletePro(typeId) {
  return request.delete(
    `/api/types/${typeId}`
  );
}

export function getUnitList(proId) {
  return request.get(
    `api/units`,
  );
}

/**
 *
 * 固件管理
 */

export function getFirmwareList(proId) {
  return request.get(
    `/api/plugins/telemetry/ENTITY_SUB_TYPE/${proId}/attribute/SHARED_SCOPE?key=firmwares`,
  );
}

export function uploadFirmware(typeId, params) {
  return request.post(
    `/api/types/${typeId}/firmware`,
    params
  );
}

// export function downLoadFirmware(blobId) {
//   return request({
//     url: `/api/blob/${blobId}/stream`,
//     method: 'get'
//   }
//   );
// }

export function downLoadFirmware(blobId) {
  return axios({
    url: `/api/blob/${blobId}/stream`,
    headers: {
      'x-Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    method: 'get',
    responseType: 'blob'
  }
  );
}

export const manyUpdataFirmware = async ({ typeId, blobId, ids }, callback) => {
  const url = `/api/types/${typeId}/firmware/${blobId}/upgrade`;
  try {
    const res = await oboe({
      url,
      method: 'post',
      headers: {
        'x-Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: ids
    }).done(function(things) {
      console.log(' manyUpdataFirmware request log json stream done', things);
      callback(typeId, blobId, things);
    });
    return res;
  } catch (err) {
    message('err', err);
  }
};

export function updateFirmware(typeId, params) {
  return request.post(
    `/api/plugins/telemetry/ENTITY_SUB_TYPE/${typeId}/attributes/SHARED_SCOPE`,
    params
  );
}

/**
 *  topic 列表  getTopicList, saveTopicList
 */

export function getTopicList(typeId) {
  return request({
    url: `/api/plugins/telemetry/ENTITY_SUB_TYPE/${typeId}/attribute/SHARED_SCOPE?key=topics`,
    method: 'get'
  });
}

export function saveTopicList(typeId, params) {
  return request.post(
    `/api/plugins/telemetry/ENTITY_SUB_TYPE/${typeId}/attributes/SHARED_SCOPE`,
    params
  );
}

/**
 *
 * 指标定义
 */

export function fetchIndicatList(typeId) {
  return request({
    url: `/api/plugins/telemetry/ENTITY_SUB_TYPE/${typeId}/attribute/SHARED_SCOPE?key=thingModel`,
    method: 'get'
  });
}

export function saveIndicatList(typeId, params) {
  return request.post(
    `/api/plugins/telemetry/ENTITY_SUB_TYPE/${typeId}/attributes/SHARED_SCOPE`,
    params
  );
}

