let websock = null;
let global_callback = null;
const token = localStorage.getItem('token');
const initWebSocket = () => {
  if (!token) {
    return;
  }
  const wsurl = `ws://${process.env.VUE_APP_BASE_WS}/api/ws/plugins/telemetry?token=${token}`;
  websock = new WebSocket(wsurl);
  websock.onmessage = (e) => {
    websocketonmessage(e);
  };
  websock.onclose = (e) => {
    websocketclose(e);
  };
  websock.onopen = () => {
    websocketOpen();
  };

  websock.onerror = (e) => {
    if (!token) {
      console.log('socket-请登录');
      return;
    }
    console.log('WebSocket连接发生错误', e);
  };
};

const sendSock = (agentData, callback) => {
  console.log('callback', callback, websock);
  global_callback = callback;
  if (websock.readyState === websock.OPEN) {
    websocketsend(agentData);
  } else if (websock.readyState === websock.CONNECTING) {
    setTimeout(() => {
      sendSock(agentData, callback);
    }, 1000);
  } else {
    setTimeout(() => {
      sendSock(agentData, callback);
    }, 1000);
  }
};

const websocketonmessage = (e) => {
  console.log('callback', global_callback);
  global_callback(e);
};

const websocketsend = (agentData) => {
  websock.send(JSON.stringify(agentData));
};

const websocketclose = (e) => {
  console.log('connection closed ' + e);
};

const websocketOpen = (e) => {
  console.log('连接成功1111');
};

initWebSocket();

export { sendSock };

