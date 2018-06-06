// pages/tellyou/tellyou.js
var Bmob = require('../../utils/bmob.js');
Page({

  /*** 页面的初始数据*/
  data: {
    bbq:'',
    searchinputvalue:'',
    inputvalue:'',
    contentdisplay:'',
    display:'none',
    cjdisplay:"none",
    background: '',
    textcolor: '',
    switchvalue:true,
    length:''
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
        that.setData({ bbq: results})
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

  searchinput:function(e)
  {
    var that = this;
    this.setData({
      searchinputvalue: e.detail.value
    })
    if (that.data.searchinputvalue == '') {
      that.setData({
        cjdisplay: 'none',
        contentdisplay: 'block'
      })
    }
  },

  input:function(e){
    var that = this;
    this.setData({
      inputvalue: e.detail.value,
      length: e.detail.value.length
    })
  },

  search:function(){
    var that = this;
    console.log(that.data.searchinputvalue)
    var Diary = Bmob.Object.extend("tellyou");
    var query = new Bmob.Query(Diary);
    query.equalTo("name", { "$regex": "" + this.data.searchinputvalue + ".*" });
    // 查询所有数据
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        if (results.length==0){
          that.setData({ cjdisplay: 'block', contentdisplay:'none'})
        }else{
          that.setData({
            bbq:results,
            cjdisplay: 'none' 
            })
        }
      },
    });
  },

  //创建表白墙
  gotocj: function()
  {
    var id = wx.getStorageSync('user_id');
    var that =  this;
    if(id =='' || id==null)
    {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    }else
    {
      var Diary = Bmob.Object.extend("tellyou");
      var query = new Bmob.Query(Diary);
      query.equalTo("parent", id);
      query.include("parent");
      // 查询所有数据
      query.find({
        success: function (results) {
          console.log("共查询到 " + results.length + " 条记录");
          if(results.length < 5)
          {
            that.setData({
              display: 'block'
            })
          }
          else{
            that.setData({
              display: 'none'
            })
            wx.showToast({
              title: '每个人最多创建5个',
              icon: 'none',
              duration: 2000
            })
          }
        },
      });
    }
  },

  //背景色选取
  backgroundcolor: function (e) {
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

  //提交表白墙保存到数据库
  bindFormSubmit: function (e) {
    var that = this;
    if (e.detail.value.textarea == '') {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({ name: e.detail.value.name })
      if (wx.getStorageSync('user_id') == '') {
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
      else if (e.detail.value.name =='')
      {
        wx.showToast({
          title: '请输入名字',
          icon: 'none',
          duration: 2000
        })
      }
      else {
        var Diary = Bmob.Object.extend("tellyou");
        var Post = Bmob.Object.extend("user_infor");
        var diary = new Diary();
        var post = new Post();
        post.id = wx.getStorageSync('user_id');
        diary.set("parent", post);
        diary.set("name", e.detail.value.name);
        diary.set("islike",1);
        diary.set("cansee", that.data.switchvalue);
        console.log(that.data.switchvalue)
        diary.save(null, {
          success: function (result) {
            console.log("一行情书创建成功, objectId:" + result.id);
            var Diary = Bmob.Object.extend("bbq");
            var Post = Bmob.Object.extend("tellyou");
            var Post1 = Bmob.Object.extend('user_infor')
            var diary = new Diary();
            var post = new Post();
            var post1 = new Post1();
            post.id = result.id;
            post1.id = wx.getStorageSync('user_id');
            diary.set("parent", post);
            diary.set("parent1", post1);
            diary.set("textcolor", that.data.textcolor == '' ? '#000' : that.data.textcolor);
            diary.set("backgroundcolor", that.data.background == '' ? '#fff' : that.data.background);
            diary.set("content", e.detail.value.textarea);
            diary.save();
            wx.showToast({
              title: '创建成功',
              icon: 'none',
              duration: 2000
            })
            var Diary = Bmob.Object.extend("tellyou");
            var query = new Bmob.Query(Diary);
            query.limit(20);
            query.descending('islike');
            query.find({
              success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
                that.setData
                  ({
                    bbq: results,
                    display:'none',
                    contentdisplay:'block',
                    cjdisplay: 'none',
                  })
              },
            });
          },
        });
      }
    }
  },

  giveout:function(){
    this.setData({
      display: 'none',
      cjdisplay: 'none',
      contentdisplay: 'block'
    })
  },

  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      switchvalue: e.detail.value
    })
  },

})