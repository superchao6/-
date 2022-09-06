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
        db.collection('all-people').get().then(res=>{
            console.log(res.data)

            // let {userdata} = event
            // console.log(userdata)

            var date = new Date()
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            //1,定义excel表格名
            let dataCVS = year + '.' + month + '.' + day + '出入情况.xlsx'
            //2，定义存储数据的
            let alldata = [];
            let row = ['姓名', '性别','日期','时间','出入状况','体温']; //表属性
            alldata.push(row);
        
            for (let key in res.data) {
                for (let index in res.data[key].IO) {
                    let arr = [];
                    arr.push(res.data[key].name);
                    arr.push(res.data[key].sex);
                    arr.push(res.data[key].IO[index].day);
                    arr.push(res.data[key].IO[index].date);
                    arr.push(res.data[key].IO[index].flag);
                    arr.push(res.data[key].IO[index].temperature);
                    alldata.push(arr)
                }
            }
            //3，把数据保存到excel里
            var buffer =  xlsx.build([{
                name: "出入情况",
                data: alldata
            }]);
            //4，把excel文件保存到云存储里
            return  cloud.uploadFile({
            cloudPath: "excel/"+dataCVS,
            fileContent: buffer, //excel二进制文件
            })
        })
    } catch (e) {
        console.error(e)
        return e
    }
}