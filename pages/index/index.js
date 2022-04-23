import mqtt from '../../utils/mqtt.js';

const host = 'wxs://www.cssxbx.xyz/mqtt';

var mqtt_txt = {
  "hour": 12,
  "min": 30,
  "order": "open"
};

Page({
  data: {
    client: null,
    //MQTT连接的配置
    options: {
      protocolVersion: 4,
      clientId: 'mqtt_pet',
      clean: false,
      password: 'public',
      username: 'admin',
      reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
      connectTimeout: 15 * 1000, //1000毫秒，两次重新连接之间的间隔
      resubscribe: true,//如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
    }
  },
  onClick_feeding: function () {

    if (this.data.client && this.data.client.connected) {
      //发布消息
      this.data.client.publish('/World', JSON.stringify(mqtt_txt));
      wx.showToast({
        title: '喂食成功',
        icon: 'success',
        duration: 2000
      })
    }
    else {
      wx.showToast({
        title: '服务器未连接',
        icon: 'error',
        duration: 2000
      })
    }

  },
  onLoad: function () {

    var that = this;
    //开始连接
    this.data.client = mqtt.connect(host, this.data.options);
    this.data.client.on('connect', function (connack) { })

    //接收订阅主题消息
    that.data.client.on("message", function (topic, payload) {
      wx.showModal({
        content: " 收到topic:[" + topic + "], payload:[" + payload + "]",
        showCancel: false,
      });
    })

    //订阅主题
    if (this.data.client) {
      this.data.client.subscribe('/World');
    }
    else {
      wx.showToast({
        title: '服务器未连接',
        icon: 'error',
        duration: 2000
      })
    }

    //服务器连接异常的回调
    that.data.client.on("error", function (error) {
      console.log(" 服务器 error 的回调" + error)
    })

    //服务器重连连接异常的回调
    that.data.client.on("reconnect", function () {
      console.log(" 服务器 reconnect的回调")
    })

    //服务器连接异常的回调
    that.data.client.on("offline", function (errr) {
      console.log(" 服务器offline的回调")
    })

    wx.setNavigationBarTitle({
      title: '宠物智能管家'
    })
  }
})


