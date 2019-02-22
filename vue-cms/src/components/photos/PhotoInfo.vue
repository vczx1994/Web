<template>
    <div class="photoinfo-container">
        <h1>{{photoinfo.title}}</h1>
        <p class="subtitle">
            <span>发表时间：{{photoinfo.add_time | dateFormat}}</span>
            <span>点击：{{photoinfo.click}}次</span>
        </p>
        <hr>
        <!-- 缩略图 -->
        <div class="thumbs">
            <vue-preview :slides="list" @close="handleClose"></vue-preview>
        </div>
        <!-- 图片内容区域-->
        <div class="content" v-html="photoinfo.content"></div>
        <!-- 3、放置一个现成的评论子组件 -->
        <cmt-box id="id"></cmt-box>
    </div>
</template>
<script>
// 1、导入评论的子组件
import comment from '../subcomponents/comment.vue'
export default {
    data(){
        return {
            //从路由中获取到的图片id
            id:this.$route.params.id,
            photoinfo:{},   //图片详情
            list:[]         //缩略图的数组
        };
    },
    created(){
        this.getPhotoInfo();
        this.getThumbs();
    },
    methods:{
        getPhotoInfo(){
            this.$http.get('api/getimageInfo/' + this.id).then(result=>{
                if(result.body.status === 0){
                    this.photoinfo = result.body.message[0];
                }
            })
        },
        getThumbs(){
            //获取缩略图
            this.$http.get('api/getthumimages/' + this.id).then(result=>{
                if(result.body.status === 0){
                   //循环每个图片数据，补全图片的宽和高
                   result.body.message.forEach(item => {
                       item.w = 600;
                       item.h = 400;
                       item.msrc = item.src;
                   });
                   //把完整的数据保存到list中
                   this.list = result.body.message; 
                }
            })
        },
        // 即将关闭的时候，调用这个处理函数
        handleClose () {
            console.log('close event')
        }
    },
    //2、注册评论子组件
    components:{        //注册评论子组件
        'cmt-box':comment
    }
    
}
</script>
<style lang="scss">
    .photoinfo-container{
         padding:3px;
        h1{
            color: #26a3ff;
            font-size:15px;
            text-align: center;
            margin: 15px 0;
        }
        .subtitle{
            display: flex;
            justify-content: space-between;
        }
        .content{
            font-size: 13px;
            line-height: 30px;
        }
        .thumbs{
            img{
                margin: 10px;
                box-shadow: 0 0 8px #999;
            }
        }
    }
</style>
