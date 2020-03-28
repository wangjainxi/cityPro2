import { cloneDeep, merge } from 'lodash';
import { compare } from '@/utils/tools';
import { getTreeList, getIconGateWayList, getAttr, stateEventTrace } from '@/api/net';
import { netData, accessData, defatultExtendData } from './data';
// import { getTopicData } from '@/api/net';
const state = {
  keepStatus: false,
  isGateWay: false,
  hasModify: false,
  netData,
  netItemData: {},
  cloneNetItemData: {},
  bigIconData: [],
  snIndexStore: 0,
  defultItemStore: '1',
  extendData: defatultExtendData,
  extendCloneData: cloneDeep(defatultExtendData),
  basicInfo: {
    additionalInfo: {
      state: {
        active: false,
        connected: false,
        inactivityTimeout: '',
        lastActivityTime: '',
        lastConnectTime: '',
        lastDisconnectTime: '',
        lastInactivityAlarmTime: '',
        lastShutdownTime: '',
        lastStartupTime: ''
      }
    }
  },
  treeData: [],
  deviceId: {
    entityType: 'DEVICE',
    entityId: ''
  },
  attrData: [],
  proList: [],
  hasNext: false,
  loadStatus: false,
  isFirst: true,
  fetchParams: {
    limit: 40,
    textOffset: '',
    idOffset: '',
    textSearch: '',
    typeId: '',
    entityType: ''
  },
  isShowEdit: false,
  childDeviceInfo: {

  }
};

const mutations = {

  KEEP_STATUS: (state, bool) => {
    state.keepStatus = bool;
  },
  CHANGE_EDIT: (state, bool) => {
    state.isShowEdit = bool;
  },
  // 获取大图标列表数据
  BIG_ICON_DATA: (state, data) => {
    // state.bigIconData = [];
    state.loadStatus = false;
    state.fetchParams.textOffset = data.nextPageLink && data.nextPageLink.textOffset;
    state.fetchParams.idOffset = data.nextPageLink && data.nextPageLink.idOffset;
    state.hasNext = data.hasNext;
    data.data.map((item, index) => {
      item.children = [
        { id: 2,
          label: '子节点',
          children: []
        },
        { id: 'channel',
          label: '串口通道',
          children: []
        }
      ];
      return item;
    });
    const temp = state.bigIconData;
    state.bigIconData = [];
    temp.push(...data.data);
    state.bigIconData = temp;
  },
  SET_CHILD_BASIC_INFO: (state, data) => {
    state.childDeviceInfo = data;
  },

  SET_CHILD_DEVICE: (state, { params, res }) => {
    console.log('SET_CHILD_DEVICE  params, res', params, res);
    console.log(' state.bigIconData', state.bigIconData);
    const { gatewayId } = params;
    state.bigIconData.map((item, index) => {
      if (item.id.id === gatewayId) {
        item.children[0].children = res.data;
      }
    });
  },

  INIT_PARAMS: (state, params) => {
    state.loadStatus = false;
    state.fetchParams.textOffset = '';
    state.fetchParams.idOffset = '';
    state.fetchParams.limit = '';
    state.fetchParams.typeId = '';
    state.hasNext = false;
    state.bigIconData = [];
    state.isFirst = true;
    if (params) {
      state.bigIconData = [];
      state.fetchParams.textSearch = params.textSearch || '';
      state.fetchParams.typeId = params.typeId || '';
      state.fetchParams.entityType = params.entityType || '';
      state.fetchParams.limit = params.limit || 40;
    }
  },

  UPDATE_ICON_DATA: (state, stateData) => {

    state.bigIconData.map((itemIcon, index) => {
      if (itemIcon.id.id === stateData.deviceId.id) {
        itemIcon.additionalInfo.state.active = stateData.state.active;
        itemIcon.additionalInfo.state.connected = stateData.state.connected;
        itemIcon.additionalInfo.state.lastConnectTime = stateData.state.lastConnectTime;
        itemIcon.additionalInfo.state.lastDisconnectTime = stateData.state.lastDisconnectTime;
        itemIcon.additionalInfo.state.lastStartupTime = stateData.state.lastStartupTime;
        if (stateData.additionalInfo) {
          itemIcon.additionalInfo.fwVer = stateData.additionalInfo.fwVer || '-';
        }
      }
      return itemIcon;
    });
  },

  // 获取网关属性列表
  GET_ATTR_DATA: (state, data) => {

    state.attrData = cloneDeep(merge([
      {
        'lastUpdateTs': 1571976468073,
        'key': 'settings',
        'value': {
          'deployCenter': [
            {
              'ip': 'cloud.moonstart.cn',
              'port': '1883',
              'accessToken': ''
            }
          ],
          'ntpServer': ['0.asia.pool.ntp.org', 'ntp1.aliyun.com', '1.asia.pool.ntp.org'],
          'network': {
            'dhcpEnable': true,
            'staticIP': '',
            'staticMask': '',
            'staticGW': ''
          },
          'logStore': {
            'endpoint': 'cloud.moonstart.cn',
            'accessKeyID': '',
            'accessKeySecret': '',
            'projectName': '',
            'logLevel': 'INFO',
            'logstoreName': 'default'
          },
          'forwardChannels': [
            {
              'name': '',
              'protocol': 'mqtt/tcp',
              'server': 'cloud.moonstart.cn',
              'port': '1883',
              'topic': '',
              'username': '',
              'password': ''
            }
          ]
        },
        'type': 'JSON'
      }
    ], data));
  },

  // 设置state
  GET_EXTEND_DATA: (state, data) => {
    const { res, params } = data;
    if (params) {
      state.bigIconData.map((item, index) => {
        if (item.id.id === params.entityId) {
          const resData = [...res[0].value];
          resData.map((extend, deviceIndex) => {
            const children = [];
            if (extend.configuration && extend.configuration.servers) {
              extend.configuration.servers.map((server, serverIndex) => {
                server.devices.map((device, deviceIndex) => {
                  children.push({ deviceName: device.deviceName });
                });
              });
              extend.children = children;
            }
            return extend;
          });
          item.children[0].children = resData;
          const extendItem = [{ value: state.bigIconData[index].children[0].children }];
          state.extendData = cloneDeep(extendItem);
          state.extendCloneData = extendItem;
          return item;
        }
      });
    }
  },
  // 设置clone state
  SET_CLONE_EXTEND_DATA: (state) => {
    state.extendCloneData = cloneDeep(state.extendDatata);
  },

  // 设置clone state
  DELETE_EXTEND_DATA: (state, snIndex) => {
    state.extendCloneData[0].value.splice(snIndex, 1);
  },

  // 设置默认index
  SET_INDEX: (state, { snIndex, defaultIem }) => {
    state.snIndexStore = snIndex;
    state.defultItemStore = defaultIem;
  },

  // netServer
  CHANGE_NET_SERVER: (state, data) => {
    state.attrData;
  },
  PUSH_CHILDREN_DATA: (state, data) => {
    const newBigIconData = state.bigIconData.concat();
    state.bigIconData = null;
    newBigIconData.map((item, index) => {
      return data.map((ele, j) => {
        item.children = [];
        if (item.id === ele.gatewayId) {
          item.children = data;
        }
        return state.bigIconData;
      });
    });
    state.bigIconData = newBigIconData;
  },
  // 改变大小图标列表状态
  CHANGE_VIEW: (state, bool) => {
    state.isGateWay = bool;
  },

  // 设置device id
  SET_DEVICEID: (state, params) => {
    state.deviceId.entityId = params.id;
    state.deviceId.entityType = params.entityType;
  },

  // 是否保存更改
  CHANGE_MODIFY: (state, bool, isLeave) => {
    if (bool) {
      state.hasModify = true;
    } else {
      state.hasModify = false;
    }
  },

  // 确认离开
  CONFIRM_LEAVE(state) {
    console.log('state.extendData', state.extendData);
    state.extendCloneData = cloneDeep(state.extendData);
    state.bigIconData.map((item, index) => {
      if (item.id.id === state.deviceId.entityId) {
        item.children[0].children = [...state.extendData[0].value];
        return item;
      }
    });
    state.hasModify = false;
  },

  // 获取tree列表数据
  TREE_DATA: (state, data) => {
    state.treeData = data;
  },
  // // 获取topic列表
  // TOPIC_LIST: (state, data) => {

  //   state.topicList = data;

  // },

  // 新建扩展
  NEW_EQUIP: (state, data) => {
    // state.extendData[0].value.push(cloneDeep(data));
    // state.extendCloneData[0].value.push(cloneDeep(data));
    if (data) {
      state.bigIconData.map((item, index) => {
        if (item.id.id === state.deviceId.entityId) {
          state.bigIconData[index].children[0].children = [data];
          const extend = [{ value: state.bigIconData[index].children[0].children }];
          state.extendData = cloneDeep(extend);
          state.extendCloneData = extend;
          return item;
        }
      });
    }
  },

  // 新建扩展批量
  newEquipMany: (state, dataArr) => {
    state.extendData[0].value.push(...dataArr);
    state.extendCloneData[0].value.push(...dataArr);
  },

  // 对比两个对象是否相等
  COMPARE_EQUIL: (state, data) => {
    const isE = compare(state.netItemData, state.cloneNetItemData);
    console.log(isE);
  },
  // 保存更新
  SAVE_UPDATE: (state, data) => {
    state.netItemData = state.cloneNetItemData;
  },
  // 获取单个设备数据
  GET_ITEM_DATA: (state, data) => {
    state.netItemData = data;
    state.cloneNetItemData = cloneDeep(data);
  },
  // 删除点位
  DELETE_POINT: (state, rowData) => {

    for (
      let i = state.cloneNetItemData.ioConfig.mbCfg.chan.length - 1;
      i >= 0;
      i--
    ) {

      if (state.cloneNetItemData.ioConfig.mbCfg.chan[i].checked) {

        state.cloneNetItemData.ioConfig.mbCfg.chan.splice(i, 1);

      }

    }

  },
  SET_BASICINFO: (state, data) => {
    state.basicInfo = data;
  },
  SET_ISFIRST: (state, bool) => {
    state.isFirst = bool;
  },
  LOAD_STATUS: (state, bool) => {
    state.loadStatus = bool;
  },
  // 产品列表
  GET_PRO_LIST: (state, data) => {
    state.proList = data;
  },

  // 添加点位
  ADD_POINT: (state, rowData) => {

    state.cloneNetItemData.ioConfig.mbCfg.chan.push({
      // 采集通道列表
      checked: false,
      tag: `IA${Date.now()}`, // 点位名称
      desc: '', // 点位描述
      slaveAddr: 1, // 从站salve
      regAddr: 0, // 寄存器地址
      funcCode: '3', // 功能码
      regCnt: 2, // 寄存器数量
      compute: 'hex2int($x)' // 计算
    });

  }
};

const actions = {
  // 纯获取大图标列表数据
  actionGetNetList({ dispatch, commit }) {
    getIconGateWayList(state.fetchParams).then(res => {
      if (res) {
        commit('BIG_ICON_DATA', res);
        dispatch('stateMonitor', res.data.map(el => el.id.id));
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  },

  // 获取大图标列表数据,包含操作
  getBigIconData({ dispatch, commit }) {
    commit('LOAD_STATUS', true);
    getIconGateWayList(state.fetchParams)
      .then(res => {
        if (res) {
          commit('BIG_ICON_DATA', res);
          if (res.data.length > 0 && state.isFirst) {
            window.localStorage.setItem('basicInfo', JSON.stringify(res.data[0]));
            commit('SET_BASICINFO', res.data[0]);
            commit('SET_ISFIRST', false);
            commit('SET_DEVICEID', res.data[0].id);
            dispatch('stateMonitor', res.data.map(el => el.id.id));
          }
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  },

  getChildDevice({ commit }, params) {
    getIconGateWayList(params)
      .then(res => {
        commit('SET_CHILD_DEVICE', { params, res });
        console.log('getChildDevice', res);
      });
  },

  // 获取tree列表数据
  getTreeData({ commit }, netId) {
    if (netId) {
      getTreeList(netId).then(res => {
        commit('PUSH_CHILDREN_DATA', res);
      })
        .catch(err => {
          console.log('err', err);
        });
    }
  },

  // 获取网关属性设置
  getAttrData({ commit }, params) {
    params.key = 'settings';
    getAttr(params)
      .then(res => {
        if (res.length) {
          const temp = res[0].value.network;
          if (Array.isArray(temp)) {
            return;
          }
        }
        commit('GET_ATTR_DATA', res);
      })
      .catch(err => {
        console.log('err', err);
      });
  },

  // 获取网关扩展管理
  getExtendData({ commit }, params) {
    params.key = 'extensions';
    getAttr(params)
      .then(res => {
        if (res.length > 0) {
          // commit('GET_EXTEND_DATA', { res, params });
        } else {
          res = [{
            'lastUpdateTs': 1575091670330,
            'key': 'extensions',
            'value': [],
            'type': 'JSON'
          }];
          // commit('GET_EXTEND_DATA', { res, params });
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  },

  // 监控设备运行状态
  async stateMonitor({ commit }, deviceIds) {
    const query = deviceIds.join('&deviceIds=');
    if (state.devStateMonotor != null) {
      state.devStateMonotor.abort();
    }
    state.devStateMonotor = await stateEventTrace(query, updateData => {
      console.log('状态更新 stateEventTrace, state', updateData);
      commit('product/UPDATE_DEVICE_STATUS', updateData, { root: true });
      commit('UPDATE_ICON_DATA', updateData);
    });
  },
  //

  // // 获取topic列表
  // getTopicList({ commit }, gateWayId) {

  //   // let topicData = getTopicData(gateWayId)
  //   commit('TOPIC_LIST', topicData);

  // },

  // 新建设备
  newEquip({ commit }, data) {
    commit('NEW_EQUIP', data);
  },

  // 获取单个设备数据
  getNetItemData({ commit }, id) {
    commit('GET_ITEM_DATA', accessData);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
