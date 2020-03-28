export default {
  name: 'Dashboard',
  data() {
    return {
      websock: null,
      reconnectData: null,
      lockReconnect: false, // 避免重复连接，因为onerror之后会立即触发 onclose
      timeout: 10000, // 10s一次心跳检测
      timeoutObj: null,
      serverTimeoutObj: null
    };
  },
  created() {
    // this.initWebSocket();
  },
  destroyed() {
    this.lockReconnect = true;
    this.websock.close(); // 离开路由之后断开websocket连接
    clearTimeout(this.reconnectData); // 离开清除 timeout
    clearTimeout(this.timeoutObj); // 离开清除 timeout
    clearTimeout(this.serverTimeoutObj); // 离开清除 timeout
  },
  methods: {
    initWebSocket() { // 初始化weosocket
      console.log('启动中');
      const token = localStorage.getItem('token');
      const wsurl = `ws://${process.env.VUE_APP_BASE_WS}/api/ws/plugins/telemetry?token=${token}`;
      this.websock = new WebSocket(wsurl);
      this.websock.onopen = this.websocketonopen; // 连接成功
      this.websock.onmessage = this.websocketonmessage; // 广播成功
      this.websock.onerror = this.websocketonerror; // 连接断开，失败
      // this.websock.onclose = this.websocketclose; // 连接关闭
    },
    websocketonopen() { // 连接成功
      console.log('连接成功222');
      //   this.heatBeat();
    },
    websocketonerror() { // 连接失败
      console.log('连接失败');
      this.reconnect();
    },
    websocketclose() { // 各种问题导致的 连接关闭
      console.log('断开连接');
      this.reconnect();
    },
    websocketonmessage(data) { // 数据接收
      // this.heatBeat();//收到消息会刷新心跳检测，如果一直收到消息，就推迟心跳发送
      console.log('receive ws data', data);
    },
    websocketsend(data) { // 数据发送
      this.websock.send(JSON.stringify(data));
    },
    reconnect() { // socket重连
      if (this.lockReconnect) { // 这里很关键，因为连接失败之后之后会相继触发 连接关闭，不然会连接上两个 WebSocket
        return;
      }
      this.lockReconnect = true;
      this.reconnectData && clearTimeout(this.reconnectData);
      this.reconnectData = setTimeout(() => {
        this.initWebSocket();
        this.lockReconnect = false;
      }, 5000);
    },
    heatBeat() {
      this.timeoutObj && clearTimeout(this.timeoutObj);
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
      this.timeoutObj = setTimeout(() => {
        //   this.websocketsend({type:'heartbeat'})   //根据后台要求发送
        this.serverTimeoutObj = setTimeout(() => {
          this.websock.close(); // 如果  5秒之后我们没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
        }, 5000);
      }, this.timeout);
    } // 心跳检测
  }
};
