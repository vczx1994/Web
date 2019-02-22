<template>
    <div class="goodsinfo-container">
        <transition
            @before-enter="beforeEnter"
            @enter="enter"
            @after-enter="afterEnter">
            <div class="ball" v-show="ballFlag" ref="ball">

            </div>
        </transition>
       <!-- 商品轮播图区域 -->
       <div class="mui-card">
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <swiper :lunbotuList="lunbotu" :isfull="false"></swiper>
                </div>
            </div>
        </div>
       <!-- 商品购买区域 -->
       <div class="mui-card">
            <div class="mui-card-header">{{goodsinfo.title}}</div>
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <p class="price">
                        市场价:<del>￥{{goodsinfo.market_price}}</del>&nbsp;&nbsp;销售价:<span class="now_price">￥{{goodsinfo.sell_price}}</span>
                    </p>
                    <p>购买数量：<numbox @getcount="getSelectedCount" :max="goodsinfo.stock_quantity"></numbox></p>
                    <p>
                        <mt-button type="primary" size="small">立刻购买</mt-button>
                        <mt-button type="danger" size="small" @click="addToShopCar">加入购物车</mt-button>
                        <!-- 分析：如何实现加入购物车时候，拿到选择的数量
                        1、经过分析发现：按钮属于goodsinfo页面，数字属于numberbox组件
                        2、由于涉及到了父子组件的嵌套了，所以无法在goodsinfo页面中获取到商品的数量值
                        3、怎么解决这个问题？（涉及到了子组件向父组件传值-事件调用机制）
                        4、事件调用的本质：父向子传递方法，子调用这个方法，同时把数据当做参数传递给这个方法 -->
                    </p>
                </div>
            </div>
        </div>
       <!-- 商品参数区域 -->
       <div class="mui-card">
            <div class="mui-card-header">商品参数</div>
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    <p>商品货号：{{goodsinfo.goods_no}}</p>
                    <p>库存情况：{{goodsinfo.stock_quantity}}件</p>
                    <p>上架时间：{{goodsinfo.add_time | dateFormat}}</p>
                </div>
            </div>
            <div class="mui-card-footer">
                <mt-button type="primary" size="large" plain @click="goDesc(id)">图文介绍</mt-button>
                <mt-button type="danger" size="large" plain @click="goComment(id)">商品评论</mt-button>
            </div>
        </div>
    </div>    
</template>
<script>
// 1、先导入轮播图组件
import swiper from '../subcomponents/swiper.vue'
// 导入选择框组件
import numbox from '../subcomponents/Goodsinfo_numbox.vue'
export default {
    data(){
        return {
            id:this.$route.params.id,            //将路由参数中的id挂载到data，方便调用
            lunbotu:[],            //轮播图的数据
            goodsinfo:{},           //获取到的商品信息
            ballFlag:false,         //小球状态属性
            selectedCount:1         //保存用户选中的商品数量，默认用户买1个
        }
    },
    created(){
        this.getLunbotu();
        this.getGoodsInfo();
    },
    methods:{
        getLunbotu(){
            // 获取轮播图数据
            this.$http.get("api/getthumimages/" + this.id).then(result=>{
                if(result.body.status === 0){
                    // 先循环轮播图数组的每一项，为item添加img属性，因为轮播图组件中，只认识item.img,不认识item.src
                    result.body.message.forEach(item=>{
                        item.img = item.src;
                    })
                    this.lunbotu = result.body.message;
                }
            })
        },
        getGoodsInfo(){
            //获取商品信息(指定id商品数据,不需要循环)
            this.$http.get("api/goods/getinfo/" + this.id).then(result=>{
                if(result.body.status === 0){
                    this.goodsinfo = result.body.message[0];
                }
            })
        },
        goDesc(id){
            // 使用编程式导航跳转图文介绍页面
            this.$router.push({name:'goodsdesc',params:{id}})
        },
        goComment(id){
            // 使用编程式导航跳转商品评论页面
            this.$router.push({name:'goodscomment',params:{id}})
        },  
        addToShopCar(){
            //添加到购物车
            this.ballFlag = !this.ballFlag;
             //{id：商品的id，count:要购买的数量，price：商品的单价，selected：false}---商品对象
             //拼接出一个，要保存到store中car数组里的商品信息对象
             var goodsinfo = {
                 id:this.id,
                 count:this.selectedCount,
                 price:this.goodsinfo.sell_price,
                 selected:true
            };
            //调用store中的mutations来将商品加入购物车
            this.$store.commit("addToCar",goodsinfo);
        },
        beforeEnter(el){
            el.style.transform = "translate(0,0)"
        },
        enter(el,done){
            el.offsetWidth;
            // 小球动画优化思路：
            // 1、先分析导致动画不准确的本质原因：我们把小球最终位移到的位置，已经局限在某一分辨率下的滚动条未滚动的情况下
            // 2、分辨率和测试的时候不一样，或者滑动条滚动一段距离后，出现问题
            // 3、原因：小球横纵坐标写死，而是根据不同情况动态计算小球的坐标值
            // 4、解题思路：先得到小球的横纵坐标，徽标的横纵坐标，然后让y值求差，x值也求差，得到的结果，就是横纵坐标要位移的距离
            // 5、如何获取徽标和小球的位置??? domObject.getBoundingClientRect()
            
            //获取小球的在页面中的位置
            const ballPosition = this.$refs.ball.getBoundingClientRect();
            //获取徽标位置(没有多少业务数据关系，稍微使用dom操作)
            const badgePosition = document.getElementById("badge").getBoundingClientRect();

            const xDist = badgePosition.left - ballPosition.left;
            const yDist = badgePosition.top - ballPosition.top;
            //字符串拼接位置
            el.style.transform = `translate(${xDist}px,${yDist}px)`;
            el.style.transition = "all 0.5s cubic-bezier(.4,-0.3,1,.68)";
            done()
        },
        afterEnter(el){
            this.ballFlag = !this.ballFlag; 
        },
        getSelectedCount(count){
            //获取商品选择数量(当子组件把选中的数量传递给父组件的时候，把选中的值保存到data上)
            this.selectedCount = count;
        }
    },
    components:{
        swiper,
        numbox
    }
}
</script>
<style lang="scss" scoped>
    .goodsinfo-container{
        background-color: #eee;
        overflow: hidden;
        .now_price{
            color:red;
            font-size:16px;
            font-weight:bold;
        }
        .mui-card-footer{
            display: block;
            button{
                margin: 10px 0;
            }
        }
        .ball{
            height: 16px;
            width:16px;
            border-radius: 50%;
            background-color: red;
            position: absolute;
            z-index:99;
            top: 391px;
            left: 148px;
        }
    }
</style>