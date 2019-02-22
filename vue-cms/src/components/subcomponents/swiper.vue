<template>
    <div>
        <mt-swipe :auto="4000">
            <!-- v-for循环渲染轮播图数据,一定要使用key-->
            <!-- 将来谁使用此轮播图组件，谁为我们传递lunbotuList -->
            <!-- 此时，lunbotuList应该是父组件向子组件传值来设置 -->
            <mt-swipe-item v-for="item in lunbotuList" :key="item.url">
                <!-- 表达式计算 -->
                <img :src="item.img" alt="" :class="{'full':isfull}">
            </mt-swipe-item>
        </mt-swipe>
    </div>
    <!-- 分析商品评论中轮播图变形的原因
    1、首页中的图片，它的宽和高，都是使用了100%的宽度
    2、在商品详情中，轮播图也使用了宽高100%，导致页面变形(理想宽度自适应)
    3、分析导致宽度是100%还是自适应
    4、既然这两个轮播图其他方面没有冲突，我们可以定义一个属性，让使用轮播图的调用者，手动指定宽度为100%还是自适应 -->
    <!-- 5、子组件定义属性isfull，并添加css样式,父组件手动绑定属性-->
</template>
<script>
export default {
    props:["lunbotuList","isfull"]   //保存轮播图的数组
}
</script>
<style lang="scss" scoped>
.mint-swipe{
    height: 200px;
    //基于父元素的第一个子元素(mint-swipe-item)的样式
    .mint-swipe-item{
        text-align:center;
        // 自适应图片大小
        img{
            height: 100%;
        }   
    }
    .full{
        width: 100%;        
    } 
}
</style>
