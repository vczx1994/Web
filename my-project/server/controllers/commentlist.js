const {mysql} = require('../qcloud')

module.exports = async (ctx)=>{
    //前端请求的参数
    const {bookid, openid} = ctx.request.query
    console.log('commentlist',{bookid,openid})
    //多表查询
    const mysqlSelect = mysql('comments')
                    .select('comments.*','cSessionInfo.user_info')
                    .join('cSessionInfo','comments.openid','cSessionInfo.open_id')
    // console.log(comments)
    let comments
    if(bookid){
        //图书详情评论列表
        comments = await mysqlSelect.where('bookid',bookid)
    }else if(openid){
        //根据openid筛选
        comments = await mysqlSelect.where('openid',openid)
    }
    ctx.state.data = {
        //映射遍历获取user_info
        list:comments.map(v=>{
            // console.log(v.user_info)
            // 将JSON字符串格式解析成对象
            const info = JSON.parse(v.user_info)
            // console.log(info)
            return Object.assign({},v,{
                title:info.nickName,
                image:info.avatarUrl
            })
        })
    }
}