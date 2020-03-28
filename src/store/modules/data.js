export const accessData = {
  supportFwVer: 'Rx.x.x', // 支持（网关）固件的版本
  sn: '04:00:00:00:00:06',
  desc: 'deviceName和xx设备温度采集', // 描述
  ioConfig: {
    period: 96, // 采集周期
    pubType: 0, // 0 周期发布， 1， 变化推送
    protocol: 'RTU', // 协议类型
    mbCfg: {
      baud: 9600, // 波特率
      stopbit: 1, // 停止位
      databit: 8, // 数据位
      parity: 'none', // 校验位
      chan: [
        {
          checked: false,
          // 采集通道列表
          tag: 'IA', // 点位名称
          desc: 'A相电流', // 点位描述
          slaveAddr: 1, // 从站salve
          regAddr: 7000, // 寄存器地址
          regCnt: 2, // 寄存器数量
          funcCode: 3, // 功能码
          compute: 'hex2float($x)' // 计算
        },
        {
          checked: false,
          tag: 'IB', // 点位名称
          desc: 'B相电流', // 点位描述
          slaveAddr: 1, // 从站salve
          regAddr: 7002, // 寄存器地址
          regCnt: 2, // 寄存器数量
          funcCode: 3, // 功能码
          compute: 'hex2float($x)' // 计算
        },
        {
          checked: false,
          tag: 'E', // 点位名称
          desc: '电能', // 点位描述
          slaveAddr: 1, // 从站salve
          regAddr: 7004, // 寄存器地址
          regCnt: 2, // 寄存器数量
          funcCode: 3, // 功能码
          compute: 'hex2float($x)' // 计算
        }
      ]
    }
  }
};

export const topicData = [
  {
    topic: '07:00:00:00:00:01/config',
    permissions: ['pub', 'sub'],
    description: '配置服务'
  },
  {
    topic: '07:00:00:00:00:01/stat',
    permissions: ['pub', 'sub'],
    description: '设备状态上报'
  }
];

export const defatultExtendData = [{
  'lastUpdateTs': 1575091670330,
  'key': 'extensions',
  'value': [{
    'id': '05:00:00:00:00:21',
    'type': 'MODBUS',
    'configuration': {
      'servers': [{
        'transport': {
          'type': 'rtu',
          'portName': 'COM1',
          'encoding': 'ascii',
          'timeout': 5000,
          'baudRate': 115200,
          'dataBits': 7,
          'stopBits': 1,
          'parity': 'even'
        },
        'devices': [{
          'unitId': 2,
          'deviceName': 'deviceName2222',
          'attributesPollPeriod': 30000,
          'timeseriesPollPeriod': 1000,
          'attributes': [{
            'tag': 'IA',
            'desc': 'A相电流',
            'type': 'long',
            'pollPeriod': 30000,
            'functionCode': 3,
            'regAddress': 4000,
            'registerCount': 2,
            'bit': 0,
            'byteOrder': 'BIG'
          }],
          'timeseries': [],
          'desc': '1'
        }]
      }]
    }
  }
  ],
  'type': 'JSON'
}];
