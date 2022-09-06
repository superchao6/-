// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env:'cloud1-7gscl6ffc039ac12'
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

    return await db.collection('all-people').where({
        function_flag:true
    })
    .update({
      data: {
        info: _.unshift({clock_flag:"未打卡",time:"未打卡",temperature:"未测试"})
      },
    })
    .then(res=>{
        db.collection('all-people').where({
            function_flag:true
        })
        .update({
          data: {
            info: _.pop(),
          },
        })
    })
    .catch(e=>{
        console.error(e)
    })

}