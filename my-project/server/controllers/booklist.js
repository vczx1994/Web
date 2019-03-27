//获取图书列表
//1、获得所有数据:mysql('book').select().where('title',rate)
// 

const {mysql} = require('../qcloud')

module.exports = async (ctx)=>{
    //数据分页
    const {page, openid} = ctx.request.query
    const size = 10
    const mysqlSelect =  mysql('books')
                    .select('books.*','cSessioninfo.user_info')
                    .join('cSessioninfo','books.openid','cSessioninfo.open_id')
                    .orderBy('books.id','desc')
    let books
    if(openid){
        //根据openid过滤
        books = await mysqlSelect.where('books.openid',openid)
    }else{
        //全部图书 分页
        books = await mysqlSelect.limit(size).offset(Number(page) * size)
    }
    ctx.state.data = {
        //将book处理为键值对
        list:books.map(v=>{
            //解析json字符串为js对象
            const info = JSON.parse(v.user_info)
            // 将原对象的可枚举属性添加nickName属性
            return Object.assign({},v,{ 
                user_info:{
                    nickName:info.nickName
                }
            })
        })
    }
}