const {mysql} = require('../qcloud')

//1、前端数据 插入
module.exports = async (ctx) =>{
    const {bookid,comment,openid,location,phone} = ctx.request.body
    console.log(bookid,comment,openid,location,phone)
    try{
        await mysql('comments').insert({bookid,comment,openid,location,phone})
        ctx.state.data = {
            msg:'success'
        }
    }catch(e){
        ctx.state = {
            code:-1,
            data:{
                msg:'评论失败:' + e.sqlMessage
            }
        }
    }
}