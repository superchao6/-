//获取应用实例
const app = getApp()
//获取数据库引用
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        massage:null,
        massage_ad:null,
        search_value:null,
        click_index:0,
        show_ad_popup:false,
        show_nad_popup:false,
        show_set_ad:false,
        show_set_nad:false
    },
    //搜索回调
    search(e){
        console.log(e)
        console.log(e.detail)
    },
    //点击头像方框，第一弹出层弹出
    click_people(e){
        console.log(e.currentTarget.dataset.index)
        if(e.currentTarget.dataset.value == "ad"){
            this.setData({
                click_index:e.currentTarget.dataset.index,
                show_ad_popup:true
            })
        }else if(e.currentTarget.dataset.value == "nad"){
            this.setData({
                click_index:e.currentTarget.dataset.index,
                show_nad_popup:true
            })
        }
    },
    //弹出层关闭函数
    onClose(){
        this.setData({
            show_ad_popup:false,
            show_nad_popup:false,
            show_set_ad:false,
            show_set_nad:false
        })
    },
    //点击第一弹出层设置管理员，第二弹出层弹出
    click_administrators(e){
        if(e.currentTarget.dataset.value == "ad"){
            this.setData({
                show_set_ad:true
            })
        }else if(e.currentTarget.dataset.value == "nad"){
            this.setData({
                show_set_nad:true
            })
        }
        // console.log(e.currentTarget.dataset.value)
    },
    //第二弹出层回调，设置/取消管理员
    set_administrators(e){
        this.onClose()
        console.log(e.currentTarget.dataset.value)
        if(e.currentTarget.dataset.value && this.data.massage[this.data.click_index].administrators==false){
            db.collection("all-people").where({
                account:this.data.massage[this.data.click_index].account
            }).update({
                data:{
                    administrators:true
                }
            }).then(e=>{
                console.log(e)
                db.collection("all-people").get()
                .then(res=>{
                    console.log(res.data)
                    this.setData({
                        massage:res.data
                    })
                })
                db.collection("all-people").where({
                    administrators:true
                }).get()
                .then(res=>{
                    console.log(res.data)
                    this.setData({
                        massage_ad:res.data
                    })
                })
            })
        }else if(!e.currentTarget.dataset.value && this.data.massage[this.data.click_index].administrators==true){
            db.collection("all-people").where({
                account:this.data.massage[this.data.click_index].account
            }).update({
                data:{
                    administrators:false
                }
            }).then(e=>{
                console.log(e)
                db.collection("all-people").get()
                .then(res=>{
                    console.log(res.data)
                    this.setData({
                        massage:res.data
                    })
                })
                db.collection("all-people").where({
                    administrators:true
                }).get()
                .then(res=>{
                    console.log(res.data)
                    this.setData({
                        massage_ad:res.data
                    })
                })
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        db.collection("all-people").get()
        .then(res=>{
            console.log(res.data)
            this.setData({
                massage:res.data
            })
        })
        db.collection("all-people").where({
            administrators:true
        }).get()
        .then(res=>{
            console.log(res.data)
            this.setData({
                massage_ad:res.data
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