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
    display1:'none',
    userInfo:'',
  },
  onLoad: function () {
    var that = this;

    //查询获得用户的objectid
    var Diary = Bmob.Object.extend("user_infor");
    var query = new Bmob.Query(Diary);
    query.equalTo("openid", wx.getStorageSync('openid'));
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        var object = results[0];
        wx.setStorageSync('user_id', object.id)
      }
    });

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
              console.log(res.userInfo.nickName)
              that.setData({
                userInfo: res.userInfo,
                display:'none',
                display1: 'show',
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

  //获得用户的信息并保存在数据库
  onGotUserInfo: function (e) {
    var that = this;
    var userinfor = e.detail.userInfo;
    that.setData({
      userInfo: userinfor,
      display: 'none',
      display1: 'show',
    })
    var Diary = Bmob.Object.extend("user_infor");
    var query = new Bmob.Query(Diary);
    query.equalTo("openid", wx.getStorageSync('openid'));
    query.find({
      success: function (results) {
        if (results.length ==0)
        {
          var User = Bmob.Object.extend("user_infor");
          var user = new User();
          user.set("openid", wx.getStorageSync('openid'));
          user.set("nickname", userinfor.nickName);
          user.set("avatarurl", userinfor.avatarUrl);
          user.set("sex", userinfor.gender);
          user.save(null,{
            success: function (result) {
              console.log("登录成功, objectId:" + result.id);
              wx.setStorageSync('user_id', result.id)
            },
          });
        }
        else{
          return
        }
      },
    });
    
  },

})
