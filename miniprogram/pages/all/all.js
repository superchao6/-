//获取应用实例
const app = getApp()
//获取数据库引用
const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        massage_all:null,
        show_popup:false,
        show_2_popup:false,
        click_index:0,
        this_mode:"考勤模式"
    },

    out_excel(){
        let that = this
        wx.showLoading({
            title: '导出中',
            mask: 'true'
        })
        //读取users表数据
        if(app.globalData.mode == "考勤模式"){
            wx.cloud.callFunction({
                name: "get_excel",
                // data: {
                //     userdata: res.data
                // },
                success(res) {
                    console.log("保存成功", res)      
                    // that.getFileUrl(res.result.fileID)
                    wx.cloud.downloadFile({
                        fileID: res.result.fileID
                        }).then(res => {
                        // get temp file path
                        console.log(res.tempFilePath)
                        const filePath = res.tempFilePath
                        wx.openDocument({
                            filePath: filePath,
                            success: function (res) {
                            console.log('打开文档成功')
                            }
                        })
                        }).catch(error => {
                        // handle error
                        })
                    wx.hideLoading()
                    wx.showToast({
                        title: '导出成功',
                        icon: 'success',
                        mask: 'true',
                        duration: 1500
                    })
                },
                fail(res) {
                    console.log("保存失败", res)
                    wx.hideLoading()
                    wx.showToast({
                        title: '导出失败',
                        icon: 'error',
                        mask: 'true',
                        duration: 1500
                    })
                }
            })
        }else if(app.globalData.mode == "出入模式"){
            wx.cloud.callFunction({
                name: "get_excel_I",
                // data: {
                //     userdata: res.data
                // },
                success(res) {
                    console.log("保存成功", res)      
                    // that.getFileUrl(res.result.fileID)
                    wx.cloud.downloadFile({
                        fileID: res.result.fileID
                        }).then(res => {
                        // get temp file path
                        console.log(res.tempFilePath)
                        const filePath = res.tempFilePath
                        wx.openDocument({
                            filePath: filePath,
                            success: function (res) {
                            console.log('打开文档成功')
                            }
                        })
                        }).catch(error => {
                        // handle error
                        })
                    wx.hideLoading()
                    wx.showToast({
                        title: '导出成功',
                        icon: 'success',
                        mask: 'true',
                        duration: 1500
                    })
                },
                fail(res) {
                    console.log("保存失败", res)
                    wx.hideLoading()
                    wx.showToast({
                        title: '导出失败',
                        icon: 'error',
                        mask: 'true',
                        duration: 1500
                    })
                }
            })
        }
    },

    //搜索函数
    search(e){
        console.log(e)
        console.log(e.detail)
    },

    click_people(e){
        console.log(e.currentTarget.dataset.index)    
        if(this.data.this_mode == "考勤模式"){        
            this.setData({
                click_index:e.currentTarget.dataset.index,
                show_popup:true
            })
        }else if(this.data.this_mode == "出入模式"){            
            this.setData({
                click_index:e.currentTarget.dataset.index,
                show_2_popup:true
            })
        }
    },
    //弹出层关闭函数
    onClose(){
        this.setData({
            show_popup:false,
            show_2_popup:false
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        db.collection('all-people').orderBy('name', 'desc').get()
        .then(res=>{
            console.log(res)
            this.setData({
                massage_all:res.data
            })
            console.log(this.data.massage_all)
        })
        .catch(console.error)
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
            this_mode:app.globalData.mode
        })
        console.log(this.data.this_mode)
        console.log(app.globalData.mode)
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