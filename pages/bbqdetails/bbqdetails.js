// pages/bbqdetails/bbqdetails.js
var Bmob = require('../../utils/bmob.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    content:'',
    butdisplay:'',
    imgdisplay:'',
    avatar:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  console.log(options.title)

  var Diary = Bmob.Object.extend("bbq");
  var query = new Bmob.Query(Diary);
  query.equalTo("parent", options.title);
  query.include("parent");
  query.find({
    success: function (results) {
      var object = results[0];
      var parsent = object.get('parent');
      console.log(parsent.avatar)
      if (parsent.avatar == null || parsent.avatar=='')
      {
        that.setData({
          butdisplay:'block',
          imgdisplay:'none'
        })
      }else{
        that.setData({
          butdisplay: 'none',
          avatar: parsent.avatar
        })
      }
      that.setData({
        content:results,
        id: options.title
      })
    },
  });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  loadfile:function(){
    var that = this;
    var time = util.formatTime(new Date());  
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length > 0) {
          var name = time + ".jpg";//上传的图片的别名，建议可以用日期命名
          var file = new Bmob.File(name, tempFilePaths);
          file.save().then(function (res) {
            console.log(res.url());

            var Diary = Bmob.Object.extend("tellyou");
            var query = new Bmob.Query(Diary);
            query.get(that.data.id, {
              success: function (result) {
                result.set('avatar', res.url());
                result.save();
                that.setData({butdisplay:'none'})
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
              },
            });
          }, function (error) {
            console.log(error);
          })
        }

      }
    })
  }
})