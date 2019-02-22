<template>
    <div class="newsinfo-container">
         <!-- 大标题 -->
        <h3 class="title">{{newsinfo.title}}</h3>
        <!-- 子标题 -->
        <p class="subtitle">
            <span>发表时间:{{newsinfo.addtime | dateFormat}}</span>
            <span>点击:{{newsinfo.click}}次</span>
        </p>
        <!-- 内容区域 -->
        <!-- 带html标签的内容 -->
        <div class="content" v-html="newsinfo.content">
        </div>
        <!-- 评论子组件区域 -->
        <!-- 3、标签形式引入子组件 -->
        <component-box :id="this.id"></component-box>
    </div>
</template>
<script>
//1、导入评论子组件
import comment from '../subcomponents/comment.vue'
export default {
    //获取url地址传递过来的id值，挂载到data上,方便以后调用---传参(params,query)
    data(){
        return{
            id:this.$route.params.id,
            newsinfo:{}         //新闻信息对象
        }
    },
    created(){
        this.getNewsInfo()
    },
    methods:{
        getNewsInfo(){
            this.$http.get("api/getnew/" + this.id).then(result=>{
                if(result.body.status === 0){
                    this.newsinfo = result.body.message[0];
                }else{
                    Toast("获取新闻失败!!")
                }
            })
        }
    },
    // 2、用来注册子组件的节点
    components:{
        'component-box':comment
    }
}
</script>
<style lang="scss" scoped>
    .newsinfo-container{
        .title{
            font-size: 16px;
            text-align: center;
            margin: 15px 0;
            color:red;
        }
        .subtitle{
            font-size: 13px;
            color:#226aff;
            display: flex;
            justify-content:space-between;
        }
        padding: 0 4px;
    }
</style>
