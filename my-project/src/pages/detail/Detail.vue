<template>
    <div>
        <Bookinfo :info='info'></Bookinfo>
        <CommentList :comments='comments'></CommentList>
        <div class="comment" v-if="showAdd">
            <textarea v-model="comment"
                    class="textarea"
                    maxlength="100"
                    placeholder="请输入图书短评">
            </textarea>
            <div class="location">
             地理位置:
                <switch color='#EA5A49' :checked='location' @change='getGeo'></switch>
                <span class="text-primary">{{location}}</span>
            </div>
            <div class="phone">
             手机型号:
                <switch color='#EA5A49' :checked='phone' @change='getPhone'></switch>
                <span class="text-primary">{{phone}}</span>
            </div>
            <button class="btn" type="warn" @click='addComment'>
                评论
            </button>
        </div>
        <div class="text-footer" v-else>
            未登录或者已经评论过啦
        </div>
        <button class="btn" type="warn" open-type="share">转发给好友</button>
    </div>
</template>
<script>
import {get,post, showModal} from '../../utils/index.js'
import Bookinfo from '../../components/Bookinfo'
import CommentList from '../../components/CommentList'
export default {
    data(){
        return {
            bookid:'',
            info:{},
            comment:'',
            location:'',
            phone:'',
            userinfo:{},
            comments:[]
        }
    },
    computed:{
        //显示添加评论
        showAdd(){
            //未登录
            if(!this.userinfo.openId){
                return false
            }
            //评论页面查到自己的openid
            if(this.comments.filter(v=>v.openid==this.userinfo.openId).length){
                return false
            }
            return true
        }
    },
    methods: {
        //获取详情
        async getDetail() {
            const info = await get('/weapp/bookdetail', { id: this.bookid })
            wx.setNavigationBarTitle({
                title:info.title
            })
            this.info = info
            console.log(info)
        },
        //获取评论列表
        async getComments(){
            const comments = await get('/weapp/commentlist', {bookid: this.bookid})
            console.log('comments',comments)
            this.comments = comments.list||[]
        },
        //评论(评论内容,手机型号，地理位置，图书id，用户openid)
        async addComment(){
            if(!this.comment){
                return 
            }
            const data = {
                comment:this.comment,
                phone:this.phone,
                location:this.location,
                bookid:this.bookid,
                openid:this.userinfo.openId
            }
            console.log(data)
            try{
                await post('/weapp/addcomment', data)
                this.comment = ''
                this.getComments()
            } catch (e){
                showModal('失败',e.msg)
            }
        },
        //获取地理位置
        getGeo(e){
            // hYR2so1oj2XcGz0LrG525382KFrYCxQ3
            const ak = 'hYR2so1oj2XcGz0LrG525382KFrYCxQ3'
            let url = 'http://api.map.baidu.com/geocoder/v2/'
            if(e.target.value){
                const location = wx.getLocation({
                    success:geo=>{
                        wx.request({
                            url,
                            data:{
                                ak,
                                location:`${geo.latitude},${geo.longitude}`,
                                output:'json',
                            },
                            success:res=>{
                               if(res.data.status==0){
                                   this.location = res.data.result.addressComponent.city
                               }else{
                                   this.location = '未知地点'
                               }
                            }
                        })                        
                        const latitude = geo.latitude
                        const longitude = geo.longitude
                    }
                })
            }else{
                this.location = ''
            }
        },
        //获取手机型号
        getPhone(e){
            //选择接受事件的元素输入的或者选择的值
            if(e.target.value){
                const phoneInfo = wx.getSystemInfoSync()
                this.phone = phoneInfo.model
            }else{
                //没选中
                this.phone = ''
            }
        }
    },
    //获取跳转的图书id
    mounted(){
        this.bookid = this.$root.$mp.query.id
        this.getDetail()
        this.getComments()
        //获取userinfo
        const userinfo = wx.getStorageSync('userinfo')
        console.log('userinfo',userinfo)
        if(userinfo){
            this.userinfo = userinfo
        }else{
            console.log('ok')
        }
    },
    components:{
        Bookinfo,
        CommentList
    },
    //分享转发
    onShow(){
        wx.showShareMenu({
            withShareTicket: true
        })
        // let userinfo = wx.getStorageSync('userinfo')
        // if(userinfo){
        //     this.userinfo = userinfo
        // }
    }
} 
</script>
<style lang='scss'>
    .comment{
        margin-top: 10px;
        .textarea{
            width: 730rpx;
            height: 200rpx;
            background-color: #eee;
            padding:10rpx;
        }
        .phone{
            margin-top: 10px;
            padding: 5px 10px;
        }
        .location{
            margin-top: 10px;
            padding: 5px 10px;
        }
    }
</style>
