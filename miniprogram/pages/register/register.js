const app = getApp()
//获取数据库引用
const db = wx.cloud.database()
Page({
    data: {
        // all_count:null,

        eye:"closed-eye",
        eye1:"closed-eye",
        show_password:"password",
        show_password1:"password",
        
        sex:null,
        show_sex: false,
        actions: [
          {name: '男'},
          {name: '女'},
        ],
        error_massage:""
    },

    choose_sex(){
        this.setData({
            show_sex : true
        })
        console.log(this.data.show_sex)
    },
    onClose() {
        this.setData({ show_sex: false });
    },
    onSelect(event) {
        console.log(event.detail);
        this.setData({
            sex:event.detail.name
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
    click_icon1(){
        // console.log("icon")
        if(this.data.eye1 == "closed-eye"){
            this.setData({
                eye1:"eye-o",
                show_password1:false
            })
        }else{
            this.setData({
                eye1:"closed-eye",
                show_password1:true
            })
        }
    },
    input_account(e){
        console.log(e.detail.value)
        db.collection("all-people").where({account:e.detail.value}).get()
        .then(res=>{
            console.log(res.data)
            if(res.data.length != 0){
                this.setData({
                    error_massage:"账号已被注册"
                })
            }else{
                this.setData({
                    error_massage:""
                })
            }
        })
    },
    //提交注册
    register(res){
        console.log(res.detail.value)
        var account = res.detail.value.account
        var password = res.detail.value.password
        var password_again = res.detail.value.password_again
        var name = res.detail.value.name
        var sex = res.detail.value.sex
        if(account==""||password==""||name==""||sex==""){
            wx.showToast({
                title: '请填写完整信息',
                icon: 'error',
                duration: 1000,
                mask:true
            })
        }
        else if(password!=password_again){
            wx.showToast({
                title: '两次密码不同',
                icon: 'error',
                duration: 1000,
                mask:true
            })
        }else if(this.data.error_massage != ""){
            wx.showToast({
                title: '账号已被注册',
                icon: 'error',
                duration: 1000,
                mask:true
            })
        }
        else{
            db.collection('allow-people').where({name:name}).get()
            .then(res=>{
                console.log(res.data)
                if(res.data.length == 0 || res.data[0].register == false){
                    console.log("无权限！")
                    wx.showModal({
                        title: '暂无权限',
                        content: '该姓名没有权限，请联系管理人员',
                        showCancel: false,
                    })
                }else if(res.data[0].register == true && res.data[0].done == true){
                    wx.showModal({
                        title: '姓名已被注册',
                        content: '有问题请联系管理人员',
                        showCancel: false,
                    })
                }else if(res.data[0].register == true){
                    db.collection('allow-people').where({name:name}).update({
                        data:{
                            done :true
                        }
                    }).then(res=>{
                        console.log(res)
                    })
                    db.collection("all-people").add({
                        data:{
                            name:name,
                            account:account,
                            password:password,
                            sex:sex,
                            function_flag:true,
                            IO:[],
                            // clock_flag:"未打卡",
                            // time:"未打卡",
                            // temperature:"未测试",
                            picture_flag:"未绑定",
                            info:[{clock_flag:"未打卡",time:"未打卡",temperature:"未测试"},
                                {clock_flag:"未打卡",time:"未打卡",temperature:"未测试"},
                                {clock_flag:"未打卡",time:"未打卡",temperature:"未测试"},
                                {clock_flag:"未打卡",time:"未打卡",temperature:"未测试"},
                                {clock_flag:"未打卡",time:"未打卡",temperature:"未测试"},
                                {clock_flag:"未打卡",time:"未打卡",temperature:"未测试"},
                                {clock_flag:"未打卡",time:"未打卡",temperature:"未测试"}],
                            attendance:0,
                            late:0,
                            fileList:[],
                            // account_id:this.data.all_count+1,
                            administrators:false,
                        }
                    }).then(res=>{
                        wx.showToast({
                            title: '注册成功',
                            icon: 'success',
                            duration: 1500,
                            mask:true
                        })
                        setTimeout(()=>{
                            wx.navigateBack({
                                url:"../log/log"
                            })
                        }, 2000)
                        console.log(res)
                    })
                }
            })
        }
    },
    // 返回登陆页面
    back_log(){
        wx.navigateBack({
            url:"../log/log"
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