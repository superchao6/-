//获取应用实例
const app = getApp()
//获取数据库引用
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show:false,
        massage:null,
        show_index:0,
        minDate: new Date().getTime()-6*24*60*60*1000,
        maxDate: new Date().getTime()+7*24*60*60*1000,
        formatter(day) {
            const month = day.date.getMonth() + 1;
            const date = day.date.getDate();

            var newmonth = new Date().getMonth() + 1;
            var newday = new Date().getDate();

            if (month === newmonth && date === newday) {
                day.text = '今天';
            }
            return day;
        },
    },

    calender(e){
        console.log(e)

        var date = e.detail.getTime()
        // console.log(date)

        var now_date = new Date()
        var year = now_date.getFullYear();
        var month = now_date.getMonth();
        var day = now_date.getDate();
        var today = new Date(year,month,day).getTime()
        // console.log(today)

        this.setData({
            show_index:(today - date)/1000/60/60/24
        })
        console.log(this.data.show_index)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        db.collection("all-people").where({
            account : app.globalData.account
        }).get()
        .then(res=>{
            console.log(res.data[0])
            this.setData({
                massage : res.data[0]
            })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.setData({
            this_mode : app.globalData.mode
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

        //导航条加载动画
        wx.showNavigationBarLoading()
        db.collection("all-people").where({
            account : app.globalData.account
        }).get()
        .then(res=>{
            console.log(res.data[0])
            this.setData({
                massage : res.data[0]
            })
            wx.hideNavigationBarLoading();
            //停止下拉刷新
            wx.stopPullDownRefresh();
        })
        .catch(e=>{
            wx.hideNavigationBarLoading();
            //停止下拉刷新
            wx.stopPullDownRefresh();
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})