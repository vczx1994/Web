<template>
    <div class="container">
        <CommentList type='user' 
                    :comments='comments'
                    v-if="userinfo.openId">
        </CommentList>
        <div v-if="userinfo.openId">
            <div class="page-title">
                我的图书
            </div>
            <Card v-for='book in books' :key="book.id" :book='book'>
            </Card>
            <div v-if="!books.length">暂时还没添加过书，快去添加几本书吧</div>
        </div>
    </div>
</template>
<script>
import {get} from '../../utils/index.js'
import CommentList from '../../components/CommentList'
import Card from '../../components/Card'
export default {
    components:{
        CommentList,
        Card
    },
    data(){
        return{
            comments:[],
            userinfo:{},
            books:[]
        }
    },
    methods:{
        init(){
            wx.showNavigationBarLoading()
            this.getComments()
            this.getBooks()
            wx.hideNavigationBarLoading()
        },
        //获取添加图书
        async getBooks(){
            const books = await get('/weapp/booklist',{
                openid:this.userinfo.openId
            })
            this.books = books.list
        },
        async getComments(){
            const comments = await get('/weapp/commentlist',{openid:this.userinfo.openId})
            this.comments = comments.list
        }
    },
    //下拉刷新
    onPullDownRefresh(){
        this.init()
        wx.stopPullDownRefresh()
    },
    //onShow--生命周期
    onShow(){
        wx.showShareMenu()
        //未登录
        if(!this.userinfo.openId){
            let userinfo = wx.getStorageSync('userinfo')
            if(userinfo){
                this.userinfo = userinfo
                this.init()         //初始化数据
            }
        }
    }
}
</script>
<style>
    
</style>