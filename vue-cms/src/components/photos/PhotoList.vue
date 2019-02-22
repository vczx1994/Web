<template>
    <div>
        <div id="slider" class="mui-slider">
            <div id="sliderSegmentedControl" class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
                <div class="mui-scroll">
                    <!-- 绑定样式，点击选择类增加css样式(三目表达式) -->
                    <a :class="[`mui-control-item`,item.id==0 ? 'mui-active' :'']" v-for="item in cates" :key="item.id" @click="getPhotoListByCateId(item.id)">
                        {{item.title}}
                    </a>
                </div>
            </div>
            <ul class="photolist">
                <router-link v-for="item in list" :key="item.id" :to="'/home/photoinfo/' + item.id" tag="li">
                    <img v-lazy="item.img_url">
                    <div class="info">
                        <h1 class="info-title">{{item.title}}</h1>
                        <div class="info-body">{{item.zhaiyao}}</div>
                    </div>
                </router-link>
            </ul>
        </div>        
    </div>
</template>
<script>
// 1、导入mui.js文件
import mui from '../../lib/mui/js/mui.min.js'
export default {
    data(){
        return {
            cates:[],           //所有分类的列表数组
            list:[]
        }
    },
    created(){
        this.getAllCategory();
        //默认进入页面，就主动请求所有图片列表的数据
        this.getPhotoListByCateId(0);
    },    
    mounted(){
        // 当组件的DOM结构被渲染好,并放入页面后，会执行这个钩子函数
        //如果要操作元素了，最好在mounted里面，因为这个时候dom元素是最新的
        // 2、初始化滑动控件
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    },
    methods:{
        getAllCategory(){
            this.$http.get("api/getimgcategory").then(result=>{
                if(result.body.status === 0){
                    // 手动拼接出一个最完整的分类列表
                    result.body.message.unshift({title:"全部",id:0});
                    this.cates =result.body.message;
                }
            })
        },
        getPhotoListByCateId(cateId){
            //根据分类Id,获取图片列表
            this.$http.get("api/getimages/" + cateId).then(result=>{
                if(result.body.status === 0){
                    this.list = result.body.message;
                }
            })
        }
    }
    
}
</script>
<style lang="scss" scoped>
    *{
        touch-action: pan-y;
    }
    .photolist{
        list-style: none;
        margin: 0;
        padding: 0 10px;
        li{
            position: relative;
            img{
                width: 100%;
                vertical-align: middle;
            }
            margin-bottom: 10px;
            box-shadow: 0 0 9px #999;
            text-align: center;
            background-color: #ccc;
            img[lazy=loading] {
                width: 40px;
                height: 300px;
                margin: auto;
            }
            .info{
                position: absolute;
                bottom: 0;
                color: white;
                background-color: rgba(0, 0, 0,0.4);
                text-align: left;
                max-height: 84px;
                .info-title{
                    font-size:14px;
                }
                .info-body{
                    font-size: 13px;
                }
            }
        }
    }
</style>
