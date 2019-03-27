<template>
    <div>
        <TopSwiper :tops='tops'></TopSwiper>
        <Card v-for='book in books' :key="book.id" :book='book'></Card>
        <p class="text-footer" v-if="!more">
            没有更多数据
        </p>
    </div>
</template>
<script>
//35条数据
//每次加载10条
//0页   0-10
//1页   10-20
//2页   20-30
//page 当前页数(参数)
//没有更多数据
//1、page=0 不能显示这条数据
//2、page>0 数据长度<10 停止触底加载

import {get} from '../../utils/index.js'
import Card from '../../components/Card'
import TopSwiper from '../../components/TopSwiper'
export default {
    //默认data里的books为空
    components:{
        Card,
        TopSwiper
    },
    data(){
        return {
            books:[],
            page:0,  //默认page为0
            more:true,
            tops:[]
        }
    },
    methods:{
        async getList(init){
            //数据初始状态
            if(init){
                this.page = 0
                this.more = true
            }
            // 下拉加载动画
            wx.showNavigationBarLoading()
            // wx.showNavigationBarLoading()
            const books = await get('/weapp/booklist',{page:this.page})
            //没有更多数据
            if(books.list.length<10 && this.page>0){
                this.more = false;
            }
            //初始数据状态
            if(init){
                this.books = books.list
                //停止并隐藏动画
                wx.stopPullDownRefresh()
            }else{
                // 下拉刷新，不能直接覆盖books，而是累加显示
                this.books = this.books.concat(books.list)
            }
            
            wx.hideNavigationBarLoading()
        },
        //获取轮播图数据
        async getTop(){
            const tops = await get('/weapp/top') 
            this.tops = tops.list
        }
    },
    //监听用户下拉刷新事件
    onPullDownRefresh(){
        this.getList(true)
        this.getTop()
    },
    //下拉刷新
    onReachBottom(){
        if(!this.more){
            // 灭有更多数据
            return false
        }
        //下一页数据
        this.page = this.page+1
        this.getList()
    },
    mounted(){
        this.getList(true)
        this.getTop()
    },
    onShow () {
        wx.showShareMenu()
        let userinfo = wx.getStorageSync('userinfo')
        if (userinfo) {
        this.userinfo = userinfo
    }
  }
}
</script>
<style>
    
</style>