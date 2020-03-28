import { manyUpdataFirmware, getUnitList, getProductList } from '@/api/product';
import { message } from '@/utils/tools';
import { cloneDeep } from 'lodash';
import Vue from 'vue';
const state = {
  firmProStore: {},
  updatingStore: {},
  updatingStoreClone: {},
  initfirmStore: {},
  jumpInit: false,
  unitList: JSON.parse(window.localStorage.getItem('unitList')),
  productParam: {
    productData: [],
    hasNext: false
  },
  deviceType: {
    typeId: '',
    blobId: ''
  }
};

const mutations = {
  UPDATE_DEVICE_STATUS: (state, updateState) => {
    if (state.firmProStore && state.firmProStore[state.deviceType.typeId]) {
      state.firmProStore[state.deviceType.typeId].map((device, idx) => {
        if (device.id.id === updateState.deviceId.id) {
          if (updateState.additionalInfo) {
            device.additionalInfo.fwVer = updateState.additionalInfo.fwVer;
            device.status = 'success';

          }
          device.additionalInfo.state.connected = updateState.state.connected;
        }
        return device;
      });
    }
  },
  SET_FIRM_STORE: (state, { typeId, blobId, netData }) => {
    state.deviceType.typeId = typeId;
    state.deviceType.blobId = blobId;
    if (!state.firmProStore.hasOwnProperty(typeId)) {
      state.firmProStore[typeId] = netData;
    }
    // else {
    //   if (!state.firmProStore[typeId].hasOwnProperty(blobId)) {
    //     state.firmProStore[typeId][blobId] = netData;
    //   }
    // }
    state.initfirmStore = cloneDeep(state.firmProStore);
  },

  SET_UPDATE_STORE: (state, { typeId, blobId, netData }) => {
    if (!state.updatingStore.hasOwnProperty(typeId)) {
      state.updatingStore[typeId] = netData;
    } else {
      state.updatingStore[typeId].push(...netData);
    }
    state.updatingStoreClone = cloneDeep(state.updatingStore);
  },

  CHANGE_STATUS_LOADING: (state, { typeId, blobId, ids, status }) => {
    ids.forEach((id) => {
      state.firmProStore[typeId].map((item, index) => {
        if (item.id.id === id) {
          item.status = 'loading';
          item.statusMsg = '更新中';
          state.firmProStore[typeId].splice(index, 1);
        }
        return item;
      });
    });
  }
};

const actions = {
  productAction ({ state }, params) {
    console.log('params', params);
    getProductList(params).then(res => {
      state.productParam.hasNext = res.hasNext;
      state.productParam.productData = res.data;
    });
  },
  getUnitAction({ state }) {
    const arr = [];
    getUnitList()
      .then(res => {
        res.data.forEach((item) => {
          arr.push({
            label: `${item.symbol} / ${item.name}`,
            value: `${item.symbol} / ${item.name}`
          });
        });

        if (arr.length > 0) {
          state.unitList = arr;
          Vue.prototype.$setlocalstorage('unitList', { unitList: arr });
        }
      });
  },

  // 获取大图标列表数据,包含操作
  manyUpdataFirmwareAction({ dispatch, commit }, { typeId, blobId, ids }) {
    const query = {
      typeId,
      blobId,
      ids
    };
    manyUpdataFirmware(query, (typeId, blobId, things) => {

      state.updatingStore[typeId].map((item, index) => {
        if (things.data.deviceId && item.id.id === things.data.deviceId.id) {
          if (things.success) {
            item.status = 'successUpdate';
            item.statusMsg = things.data.result.msg;
          } else {
            item.status = 'error';
            item.statusMsg = things.error;
          }
          setTimeout(() => {
            state.updatingStore[typeId].forEach((ele, idx) => {
              if (item.id.id === ele.id.id) {
                state.updatingStore[typeId].splice(idx, 1);
                state.firmProStore[typeId].unshift(item);
                if (state.updatingStore[typeId].length === 0) {
                  state.jumpInit = true;
                }
              }
            });

          }, 3000);
        }
        return item;
      });
    })
      .then(res => {
        console.log('manyUpdataFirmware res', res);
      })
      .catch(err => {
        message('error', err);
        console.log('manyUpdataFirmware err', err);
      });
  }

};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
