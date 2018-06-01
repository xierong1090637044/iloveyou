var app = getApp()
var Bmob = require('../../utils/bmob.js'); 
var wxDraw = require("../../utils/wxdraw.min.js").wxDraw;
var Shape = require("../../utils/wxdraw.min.js").Shape;
var AnimationFrame = require("../../utils/wxdraw.min.js").AnimationFrame;
Page({
  data: {
    width:'',
    height:'',
   display:'',
   userInfo:'',
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth,
        })
      }
    })
    
    var context = wx.createCanvasContext('fire')
    that.wxCanvas = new wxDraw(context, 0, 0, 400, 500);
    var img = [];
    for (var i = 1; i < 16; i++) {
      var xxposition = Math.floor(Math.random() * 400);
      img[i] = new Shape('image', { x: xxposition, y: 10 + i * 10, w: 6, h: 6, file: "../../images/xx.png" }, 'fill', false)
      that.wxCanvas.add(img[i]);
        img[i].animate({opacity: 0,}, {
          duration:3000
        }).start(true)
    };
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              that.setData({
                userInfo: res.userInfo,
                display:'none'
              })
            }
          })
        }
      }
    })

    
  },

// Do something when show.
  onShow: function (options) {

  },

  onUnload: function () {
    this.wxCanvas.clear(); //推荐这个
  },

  onGotUserInfo: function (e) {
    var that = this;
    console.log(e.detail.userInfo)
    that.setData({
      userInfo: e.detail.userInfo,
      display: 'none'
    })
  },
})
