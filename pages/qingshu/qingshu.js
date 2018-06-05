// pages/qingshu/qingshu.js
var Bmob = require('../../utils/bmob.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length:'0',
    display:'none',
    name:'',
    qingshu:'',
    background:'',
    textcolor:'',
    times:3,
    qingshulength:'',
    tapIndex:0,
    islike:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
   //查询一行情书表

     if(wx.getStorageSync('qingshu')==''){
       var Diary = Bmob.Object.extend("qingshu");
       var query = new Bmob.Query(Diary);
       query.limit(20);
       query.descending('islike');
       query.find({
         success: function (results) {
           console.log("共查询到 " + results.length + " 条记录");
           wx.setStorageSync('qingshu',results)
           that.setData({ qingshu: wx.getStorageSync('qingshu') })
           /*for (var i = 0; i < results.length; i++) {
             var object = results[i];
             console.log(object.id);
           }*/
         },
       }); 
     }else
     {
       that.setData({ qingshu: wx.getStorageSync('qingshu') })
     }
      
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
    var that = this 
    that.setData({
      qingshu: wx.getStorageSync('qingshu')
    }) 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  console.log('hide')
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
  onShareAppMessage: function () {
  
  },

  //点击创建
  edit:function(){
    this.setData({
      display:'show'
    })
  },

  //点击热度
  paixu:function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['热度', '时间'],
      success: function (res) {
        console.log(res.tapIndex)
          var Diary = Bmob.Object.extend("qingshu");
          var query = new Bmob.Query(Diary);
          query.limit(20);
          res.tapIndex == 0 ? query.descending('islike'):query.descending('createdAt');
          query.find({
            success: function (results) {
              console.log("共查询到 " + results.length + " 条记录");
              wx.setStorageSync('qingshu', results)
              that.setData({
                qingshu: wx.getStorageSync('qingshu'), 
                tapIndex: res.tapIndex, 
                qingshulength: results.length
                })
              var qingshu = that.data.qingshu;
              console.log(qingshu)
              var id = [];
              for (var i in results) {
                id[i] = results[i].id
              }
              var islike = wx.getStorageSync('islike');
              for (var j in islike) {
                let currentIndex = id.findIndex(item => item === islike[j]);
                that.setData({
                  ['qingshu[' + currentIndex + '].added']: true
                });

              }
              wx.setStorageSync('qingshu', qingshu)
              console.log(id)
            },
          });
      },
    })
  },

  giveout:function(){
    this.setData({
      display: 'none'
    })
  },

  hidden:function(){
    this.setData({
      display: 'none'
    })
  },

  input:function(e){
    this.setData({
      length: e.detail.value.length
    })
  },

  //提交一行情书保存到数据库
  bindFormSubmit: function (e) {
    var that = this;
    var random = Math.floor(Math.random() * 10);
    if (e.detail.value.textarea==''){
      wx.showToast({
        title: '内容不能为空',
        icon:'none',
        duration: 2000
      })
    }else{
        this.setData({name:e.detail.value.name})
        if(wx.getStorageSync('user_id')==''){
          wx.showToast({
            title: '请先去登录',
            icon: 'none',
            duration: 2000
          })
        }
        else if (this.data.length < 10) {
          wx.showToast({
            title: '内容太少哦',
            icon: 'none',
            duration: 2000
          })
        }
        else{
          var Diary = Bmob.Object.extend("qingshu");
          var Post = Bmob.Object.extend("user_infor");
          var diary = new Diary();
          var post = new Post();
          post.id = wx.getStorageSync('user_id');
          diary.set("parent", post);
          diary.set("textcolor", this.data.textcolor == '' ? '#000' : this.data.textcolor);
          diary.set("backgroundcolor", this.data.background == '' ? '#fff' : this.data.background);
          diary.set("name", e.detail.value.name == '' ? '匿名' : e.detail.value.name);
          diary.set("islike", 0);
          diary.set("content", e.detail.value.textarea);
          diary.set("random", random);
          diary.save(null, {
            success: function (result) {
              console.log("一行情书创建成功, objectId:" + result.id);
              wx.showToast({
                title: '创建成功',
                icon: 'none',
                duration: 2000
              })
              var Diary = Bmob.Object.extend("qingshu");
              var query = new Bmob.Query(Diary);
              query.limit(20);
              query.descending('createdAt');
              query.find({
                success: function (results) {
                  console.log("共查询到 " + results.length + " 条记录");
                  wx.setStorageSync('qingshu', results)
                  that.setData
                  ({ 
                    qingshu: wx.getStorageSync('qingshu'),
                    display:'none',
                    tapIndex:1
                    })
                  var qingshu = that.data.qingshu;
                  var id = [];
                  for (var i in results) {
                    id[i] = results[i].id
                  }
                  var islike = wx.getStorageSync('islike');
                  for (var j in islike) {
                    let currentIndex = id.findIndex(item => item === islike[j]);
                    that.setData({
                      ['qingshu[' + currentIndex + '].added']: true
                    });

                  }
                  wx.setStorageSync('qingshu', qingshu)
                  console.log(id)
                },
              });
            },
          });
        }
      }
  },

//背景色选取
  backgroundcolor: function(e)
  {
    console.log(e.currentTarget.dataset.color)
    this.setData({
      background: e.currentTarget.dataset.color
    })
  },

  //文字颜色色选取
  textcolor: function (e) {
    console.log(e.currentTarget.dataset.color)
    this.setData({
      textcolor: e.currentTarget.dataset.color
    })
  },

  load :function(){
    var that = this;
    if (that.data.qingshulength % 20 !=0)
    {
    }else{
      wx.showLoading({
        title: '加载中',
        mask: true,
        success: function () {
          //查询一行情书表
          var Diary = Bmob.Object.extend("qingshu");
          var query = new Bmob.Query(Diary);
          that.data.tapIndex == 0 ? query.descending('islike') : query.descending('createdAt');
          query.limit(10 * that.data.times);
          query.find({
            success: function (results) {
              console.log("共查询到 " + results.length + " 条记录");
              setTimeout(function () {
                wx.hideLoading();
              }, 2000)
              wx.setStorageSync('qingshu', results)
              that.setData
              ({
                qingshulength: results.length, 
                times: that.data.times + 1,
                qingshu: wx.getStorageSync('qingshu')
                })
                
              var qingshu = that.data.qingshu;
              console.log(qingshu)
              var id = [];
              for (var i in results) {
                id[i] = results[i].id
              }
              var islike = wx.getStorageSync('islike');
              for (var j in islike) {
                let currentIndex = id.findIndex(item => item === islike[j]);
                that.setData({
                  ['qingshu[' + currentIndex + '].added']: true
                });
              }
              wx.setStorageSync('qingshu', qingshu)
              console.log(id)
            },
          });
        }
      })
    }
  },

  //点赞功能
  islike:function(e)
  {
    var that = this;
    let index = 0 
    var id = e.currentTarget.dataset.id;
    var qingshu = that.data.qingshu;
    let currentIndex =qingshu.findIndex(item => item.objectId === id);
    console.log(qingshu)
    that.setData({
      ['qingshu[' + currentIndex + '].added']: true
    });
    wx.setStorageSync('qingshu', qingshu)
    var islikenub = wx.getStorageSync('islike') ||[];
    var newmessage =[];
    console.log(islikenub)
    if (islikenub.includes(id))
    {
      console.log('你已经点赞过了')
      var m = 0;
      for (var j in islikenub) {
        if (islikenub[j] != id) {
          newmessage[m] = islikenub[j];
          m++
        }
      }
      wx.setStorageSync('islike', newmessage);//删除取消赞的mid
    }else{
      islikenub.unshift(id)
      wx.setStorageSync('islike', islikenub)
    }
  }

})