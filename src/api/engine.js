import request from '@/utils/request';
export const getEngineList = (params) => {
  let paramsStr = '';
  for (const i in params) {
    if (params[i]) {
      paramsStr += `${i}=${params[i]}&&`;
    }
  }
  paramsStr = paramsStr.slice(0, paramsStr.length - 2);
  const res = request({
    url: `/api/tenant/engineRules?${paramsStr}`,
    method: 'get'
  });
  return res;
};

export const createEngine = (params) => {
  return request.post(
    `/api/engineRules`,
    params
  );
};

export const deleteEngine = (ruleId) => {
  return request.delete(
    `/api/engineRules/${ruleId}`
  );
};

export const testEngine = (ruleId, params) => {
  return request.post(
    `/api/engineRules/${ruleId}/test`,
    params
  );
};

export const launchEngine = (params) => {
  return request.post(
    `/api/engineRules/${params.id}/action`,
    { operation: params.operation }
  );
};

