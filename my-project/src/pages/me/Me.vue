<template>
    <div class="container">
        <div class="userinfo" @click='login'>
            <img class="userinfo-avatar" :src="userinfo.avatarUrl" alt="">
            <p class="userinfo-nickname">{{userinfo.nickName}}</p>
        </div>
        <YearProgress></YearProgress>
        <button v-if="userinfo.openid" class="btn" @click='scanBook'>添加图书</button>
        <button v-else open-type="getUserInfo" lang="zh_CN" class='btn' @getuserinfo="login">点击登录</button>
    </div>
</template>
<script>
import {showSuccess, post, showModal} from '../../utils/index.js'
import qcloud from 'wafer2-client-sdk'
import config from '../../config.js';
import YearProgress from '../../components/YearProgress'
export default {
    components:{
        YearProgress
    },
    data(){
        return {
            userinfo:{
                avatarUrl:"/static/images/unknown.png",
                nickName:''
            }
        }
    },
    methods: {
        //图书录入
        async addBook(isbn){
            const res = await post('/weapp/addbook',{
                isbn,
                openid:this.userinfo.openId
            })
            // console.log(res)
            showModal('添加成功',`${res.title}添加成功`)
        },
        //扫码功能
        scanBook () {
            wx.scanCode({ 
                success: (res) => {
                    if(res.result){
                        // console.log(res.result)
                        this.addBook(res.result)
                    }
                }
            })
        },
        //登录成功保存数据
        loginSuccess (res) {
            showSuccess('登录成功')
            wx.setStorageSync('userinfo', res)
            this.userinfo = res
        },
        login () {
            wx.showToast({
                title:'登录中',
                icon:'loading'
            })
            qcloud.setLoginUrl(config.loginUrl);
            const session = qcloud.Session.get()
            if(session){
                qcloud.loginWithCode({
                    success: res=>{
                        console.log('登录没过期', res);
                        this.loginSuccess(res)
                    },
                    fail:err=>{
                        console.error(err)
                    }
                });
            }else{
                qcloud.login({
                    success: res=>{
                        console.log('登录成功', res);
                        this.loginSuccess(res)
                    },
                    fail:err=>{
                        console.error(err)
                    }
                });
            }
  
        }
    },
    onShow() {
        wx.showShareMenu()
        let userinfo = wx.getStorageSync('userinfo')
        // console.log(this.userinfo)
        if(userinfo){
            this.userinfo = userinfo
        }
    },
    
}
</script>

<style lang='scss'>
    .container{
        padding: 0 30rpx;
        .userinfo{
            margin-top: 100rpx;
            text-align: center;
            img{
                width:150rpx;
                height:150rpx;
                margin:20rpx;
                border-radius: 50%;
            }
        }
    }
</style>