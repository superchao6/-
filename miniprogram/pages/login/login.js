// 获取数据库引用
const db = wx.cloud.database()
const app = getApp();
Page({

    data: {
        account:null,
        password:null,
        eye:"closed-eye",
        show_password:"password",
    },
    input_account(e){
        // console.log("账号："+e.detail)
        this.setData({
            account:e.detail
        })
    },
    input_password(e){
        console.log("密码："+e.detail)
        this.setData({
            password:e.detail
        })
    },
    click_icon(){
        // console.log("icon")
        if(this.data.eye == "closed-eye"){
            this.setData({
                eye:"eye-o",
                show_password:false,
            })
        }else{
            this.setData({
                eye:"closed-eye",
                show_password:true,
            })
        }
    },
    log_on(){
        // 判断是否输入了账号和密码
        if(this.data.account == null){
            wx.showToast({
                title: '请输入账号',
                icon: 'error',
                duration: 1000,
                mask:true
            })
            return 0
        }else if(this.data.password == null){
            wx.showToast({
                title: '请输入密码',
                icon: 'error',
                duration: 1000,
                mask:true
            })
            return 0
        }
        // 从数据库读取账户信息
        console.log("输入的账号："+this.data.account),
        db.collection('all-people').where({
              account: this.data.account
        }).field({
            account:true,
            password:true
        }).get()
        .then(res=>{//账号正确
            console.log(res.data[0].password)
            // 判断密码是否正确
            if(res.data[0].password==this.data.password){
                app.globalData.account = this.data.account
                console.log("log on successfully"),
                wx.reLaunch({
                    url: '../homepage/homepage'
                  })
            }else{
                wx.showToast({
                    title: '密码错误',
                    icon: 'error',
                    duration: 2000,
                    mask:true
                })
            }
        })
        .catch(err=>{//账号错误
                console.log(err)
                wx.showToast({
                    title: '账号错误',
                    icon: 'error',
                    duration: 2000,
                    mask:true
                })
            }
        )
    },
    register(){
        wx.navigateTo({   //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）后续可以使用wx.navigateBack 可以返回;
            url:"../register/register"
        })
    },
    getdata(){
        wx.cloud.callFunction({
            name:"getdata"
        })
        .then(res=>{
            console.log(res)
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    }
})