//获取数据库引用
const db = wx.cloud.database()
const app = getApp()
Page({
    data: {
        i:0,
        massage:{},
        show_pic:"",
        fileList:[],
    },

    upload_face(FilePatns, count, successed, failed){
        //显示上传提示框
        if(successed + failed == 0){
            wx.showLoading({
                title: '上传中',
                mask: 'true'
            })
        }
        //上传一张图片
        wx.cloud.uploadFile({
            cloudPath: 'face/' + app.globalData.account + new Date().getTime() + '.jpg',
            filePath: FilePatns[successed].url, // 文件路径
        }).then(res => {
            // get resource ID
            console.log(res.fileID)
            //更新显示缩略图
            this.data.fileList.push({url:res.fileID})
            this.setData({
                fileList: this.data.fileList
            })
            successed = successed + 1
            console.log("successed:"+successed+"failed:"+failed+"count:"+count)
            if(successed + failed < count){
                console.log("success!" + successed)
                this.upload_face(FilePatns,count,successed,failed)
            }else if(successed + failed == count){
                console.log("all success!")
                //取消上传提示框
                wx.hideLoading()
                //更新上传图片地址
                db.collection('all-people').where({
                    account: app.globalData.account
                }).update({
                    // data 传入需要局部更新的数据
                    data: {
                      // 表示将 done 字段置为 true
                      fileList: this.data.fileList,
                      picture_flag: '已绑定'
                    },
                    success: function(res) {
                        console.log(res)
                    }
                })
                
                //显示上传成功提示框
                wx.showToast({
                    title: '成功'+successed+'张，失败'+failed+'张',
                    icon: 'success',
                    duration: 2000
                })
                return true
            }else{
                console.log("failed!")
                return true
            }
        }).catch(error => {
            failed = failed + 1
            if(successed + failed < count){
                console.log("success!" + successed)
                this.upload_face(FilePatns,count,successed,failed)
            }else if(successed + failed == count){
                console.log("all over!")
                //取消上传提示框
                wx.hideLoading()
                db.collection('all-people').where({
                    account: app.globalData.account
                }).get()
                .then(res => {
                    console.log(res.data[0]);
                    this.setData({
                        massage : res.data[0],
                        fileList:res.data[0].fileList
                    })
                })
                //显示上传成功提示框
                wx.showToast({
                    title: '成功'+successed+'张，失败'+failed+'张',
                    icon: 'success',
                    duration: 2000
                })
            }
            // handle error
        })
    },

    afterRead(event) {
        // console.log(event.detail.file.length)
        console.log(event.detail.file)
        this.upload_face(event.detail.file,event.detail.file.length,0,0)
    },

    DeletePicture(e){
        console.log(e.detail)
        this.data.fileList.splice(e.detail.index,1)
        wx.cloud.deleteFile({
            fileList: [e.detail.file.url], // 文件唯一标识符 cloudID, 可通过上传文件接口获取
            success: console.log,
            fail: console.error
        })
        db.collection('all-people').where({
            account: app.globalData.account
        }).update({
            data: {
              fileList: this.data.fileList
            },
            success: function(res) {
              console.log(res)
            }
        })
        this.setData({
            fileList: this.data.fileList
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        db.collection('all-people').where({
            account: app.globalData.account
        }).get()
        .then(res => {
            console.log(res.data[0]);
            this.setData({
                massage : res.data[0],
                fileList:res.data[0].fileList
            })
        })
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