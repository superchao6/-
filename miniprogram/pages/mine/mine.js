//获取应用实例
const app = getApp()
//获取数据库引用
const db = wx.cloud.database()
Page({
    data: {
        massage:{},
        time: null,
        mode_show: false,
        this_mode: null,
        mode_actions: [
            {
              name: '考勤模式',
            },
            {
              name: '出入模式',
            },
          ],
    },
    //点击时间设置按钮
    set_time_button(){
        this.setData({
            show:true
        })
    },
    //关闭弹窗层
    onClose(){
        this.setData({
            mode_show:false,
            show:false
        })
    },
    //设置时间确定函数
    set_time(e){
        console.log(e)
        console.log(e.detail)
        this.onClose()
    },
    //点击导出打卡情况按钮，导出excel
    get_file(){
        wx.navigateTo({
            url: '../all/all'
        })
    },
    change_mode(){
        this.setData({
            mode_show:true
        })
    },
    onSelect_mode(e){
        // console.log(e)
        console.log(e.detail.name)
        this.setData({
            this_mode:e.detail.name
        })
        app.globalData.mode=e.detail.name
    },

    onLoad: function () {

    },
      /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        db.collection("all-people").where({account:app.globalData.account}).get()
        .then(res => {
            console.log(res.data[0])
            this.setData({
                massage:res.data[0]
            })
        })
        var currenttime = new Date()
        var hour = currenttime.getHours();
        var minute = currenttime.getMinutes();
        this.setData({
            time:hour+":"+minute,
            this_mode:app.globalData.mode
        })
        // console.log(this.data.this_mode)
        // console.log(app.globalData.mode)
    },

    //跳转到信息编辑页面
    change_massage(){
        wx.navigateTo({
            url: '../massage/massage'
        })
    },
    change_administrators(){
        wx.navigateTo({
            url: '../addAd/addAd'
        })
    },

})
