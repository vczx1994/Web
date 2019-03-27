const https = require('https')
const {mysql} = require('../qcloud')
// 新增图书
// 1、获取豆瓣信息
// api:https://api.douban.com/v2/book/isbn/
// 2、入库
module.exports = async (ctx)=>{
    const {isbn, openid} = ctx.request.body
    if(isbn && openid){
        //查询添加图书是否存在
        const findRes = await mysql('books').select().where('isbn',isbn)
        if(findRes.length){
            ctx.state = {
                code: -1 ,
                data:{
                    msg:'图书已存在'
                }
            }
            return
        }    

        let url = 'https://douban.uieee.com/v2/book/isbn/'+isbn
        console.log(url)
        //获得请求到的数据
        const bookinfo = await getJSON(url)
        console.log(bookinfo)
        const rate = bookinfo.rating.average
        const {title, image, alt, publisher, summary, price} = bookinfo
        //拼接成字符串:tag:科幻 1000, 小说 500
        const tags = bookinfo.tags.map(v=>{
            return `${v.title} ${v.count}`
        }).join(',')
        const author = bookinfo.author.join(',')
        // console.log({
        //     rate,title, image, alt, publisher, summary, price,tags,author
        // })
        //数据入库(错误处理)
        try{
            await mysql('books').insert({
                isbn,openid,rate,title,image,alt,publisher,summary,price,tags,author
            })
            ctx.state.data = {
                title,
                msg:'success'
            }
        }catch(e){
            ctx.state = {
                code: -1,
                data:{
                    msg:'新增失败:'+e.sqlMessage
                }
            }
        }
        
    }
}
// 获取JSON数据
function getJSON(url){
    return new Promise((resolve, reject)=>{
        https.get(url,res=>{
            let urlData = ''
            res.on('data', data=>{
                urlData += data  
            }) 
            res.on('end', data=>{
                const bookinfo = JSON.parse(urlData)
                if(bookinfo.title){
                    resolve(bookinfo)
                }
                reject(bookinfo)
            })
        })
    })
}