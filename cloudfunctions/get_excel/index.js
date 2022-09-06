// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env:'cloud1-7gscl6ffc039ac12'
})
const db = cloud.database()
//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        let usersdata;
        await db.collection('all-people').get().then(res=>{
            console.log(res.data)
            usersdata = res.data
        })
            // let {userdata} = event
            console.log(usersdata)

            var date = new Date()
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            //1,定义excel表格名
            let dataCVS = year + '.' + month + '.' + day + '打卡情况.xlsx'
            //2，定义存储数据的
            let alldata = [];
            let row = ['姓名', '性别','体温','打卡时间','出勤状况']; //表属性
            alldata.push(row);
        
            for (let key in usersdata) {
                let arr = [];
                arr.push(usersdata[key].name);
                arr.push(usersdata[key].sex);
                arr.push(usersdata[key].info[0].temperature);
                arr.push(usersdata[key].info[0].time);
                arr.push(usersdata[key].info[0].clock_flag);
                alldata.push(arr)
            }
            //3，把数据保存到excel里
            var buffer = await xlsx.build([{
                name: "打卡情况",
                data: alldata
            }]);
            //4，把excel文件保存到云存储里
            return await cloud.uploadFile({
                cloudPath: "excel/"+dataCVS,
                fileContent: buffer, //excel二进制文件
            })
    } catch (e) {
        console.error(e)
        return e
    }
}