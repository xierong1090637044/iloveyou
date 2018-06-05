// pages/tellyou/tellyou.js
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputvalue:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //查询一行情书表
    var Diary = Bmob.Object.extend("tellyou");
    var query = new Bmob.Query(Diary);
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        that.setData({ qingshu: results, qingshulength: results.length })
        /*for (var i = 0; i < results.length; i++) {
          var object = results[i];
          console.log(object.id);
        }*/
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

  input:function(e){
    this.setData({
      inputvalue: e.detail.value
    })
  },

  search:function(){
    console.log(this.data.inputvalue)
    var Diary = Bmob.Object.extend("tellyou");
    var query = new Bmob.Query(Diary);
    query.equalTo("name", { "$regex": "" + this.data.inputvalue + ".*" });
    // 查询所有数据
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        if (results.length==0){
          
        }
        /*for (var i = 0; i < results.length; i++) {
          var object = results[i];
          console.log(object.id);
        }*/
      },
    });
  }

})