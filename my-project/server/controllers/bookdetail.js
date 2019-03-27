const {mysql} = require('../qcloud')

module.exports = async (ctx) =>{
    const {id} = ctx.request.query
    const detail = await mysql('books')
                        .select('books.*','cSessioninfo.user_info')
                        .join('cSessioninfo','books.openid','cSessioninfo.open_id')
                        .where('id',id)
                        .first()
    // console.log(detail)
    const info = JSON.parse(detail.user_info)
    console.log(info)
    //复制原对象到目标对象
    ctx.state.data = Object.assign({},detail,{
        tags:detail.tags.split(','),
        summary:detail.summary.split('\n'),
        user_info:{
            name:info.nickName,
            image:info.avatarUrl
        }
    })

    await mysql('books')
        .where('id',id)
        .increment('count', 1)
} 