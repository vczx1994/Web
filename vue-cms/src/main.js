//入口文件
import Vue from 'vue'
import app from './App.vue'
// 1.1导入并安装路由
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 按需要导入mint-ui组件--轮播图
// import { Header, Swipe, SwipeItem,Button,Lazyload} from 'mint-ui';
// Vue.component(Header.name, Header);
// Vue.component(Swipe.name, Swipe);    // 使用轮播图组件
// Vue.component(SwipeItem.name, SwipeItem);
// Vue.component(Button.name, Button);
// Vue.use(Lazyload);
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

// 导入MUI样式
import './lib/mui/css/mui.min.css'
import './lib/mui/css/icons-extra.css'

//导入安装图片预览插件
import VuePreview from 'vue-preview'
Vue.use(VuePreview)

// 1.2导入自己的router.js路由模块
import router from './router.js'

//2.1导入并安装vue-resource
import VueResource from 'vue-resource'
Vue.use(VueResource)

//1、注册vuex
//2、挂载到vm
//3、
import Vuex from 'vuex'
Vue.use(Vuex)

//2、每次刚进入网站，肯定会调用main.js在刚调用的时候，先从本地存储中把购物车中的数据取出来放到store中
var car = JSON.parse(localStorage.getItem("car") || "[]")

var store = new Vuex.Store({
    state:{     //this.$store.state.***
        car:car      //将购物车中的商品的数据，用一个数组存储起来，在car数组中，存储一些商品的对象，咱们可以暂时将这个对象设计成
                    //{id：商品的id，count:要购买的数量，price：商品的单价，selected：false}
    },
    mutations:{    //this.$store.commit('方法名称','按需传递唯一的参数')
        addToCar(state,goodsinfo){
            //点击加入购物车,把商品信息保存到store中的car
            //分析：
            //1、如果购物车中，之前就有这个对应的商品了,那么,只需要更新数量
            //2、如果没有，则直接把商品push到car中即可

            //假设在购物车中，没有找到对应的商品
            var flag = false

            state.car.some(item=>{              //some非遍历，存在即停止
                if(item.id == goodsinfo.id){
                    item.count += parseInt(goodsinfo.count)
                    console.log(item.count)
                    flag = true     //购物车中存在商品状态
                    return true     //终止some循环
                }
            })
            //如果最终，循环完毕，得到的flag还是false，则把商品直接push到购物车中
            if(!flag){
                console.log("已有商品")
                state.car.push(goodsinfo)
                console.log(goodsinfo)
            }
            //1、当更新car之后，把car数组，存储到本地的localStorage中--2、取出传给car--前面执行
            localStorage.setItem('car',JSON.stringify(state.car))
        },
        updateGoodsInfo(state, goodsinfo){
            //修改购物车中商品的数量值
            //分析：
            state.car.some(item=>{
                if(item.id == goodsinfo.id){
                    item.count = parseInt(goodsinfo.count)
                    return true
                }
            })
            //当修改完商品的数量，把最新的购物车数据保存到本地存储中
            localStorage.setItem('car',JSON.stringify(state.car))
        },
        //删除购物车中数据(组件中调用)
        removeFromCar(state,id){
            //根据Id，从store中的购物车中删除对应的那条商品数据
            state.car.some((item,i)=>{
                if(item.id == id){
                    state.car.splice(i,1)
                    return true;
                }
            })
            //将删除完毕后的，最新的购物车数据，同步到本地存储中
            localStorage.setItem('car',JSON.stringify(state.car))
        },
        //更新商品选中状态
        updateGoodsSelected(state,info){
            state.car.some(item=>{
                if(item.id == info.id){
                    item.selected = info.selected
                }
            })
            //把最新的所有购物车商品的状态保存到store中去
            localStorage.setItem('car',JSON.stringify(state.car))
        }
    },
    getters:{      //this.$store.getters.***
            //相当于计算属性,也相当于filters
            getAllCount(state){
                var c = 0;
                state.car.forEach(item=>{
                    c += item.count
                })
                return c
            },
            //获取商品数量,返回一个{商品id数量}对象--父组件向子组件传值(商品数量)
            getGoodsCount(state){
                var o = {}
                state.car.forEach(item=>{
                    o[item.id] = item.count
                })
                return o
            },
            // 获取购物车商品选中状态
            getGoodsSelected(state){
                var o = {}
                state.car.forEach(item=>{
                    o[item.id] = item.selected
                })
                return o;
            },
            //获取商品数量和金额
            getGoodsCountAndAmount(state){
                var o = {
                    count:0,  //勾选数量
                    amount:0    //勾选总价
                }
                //遍历所有商品数量金额,返回一个对象给store
                state.car.forEach(item=>{
                    if(item.selected){
                        o.count += item.count
                        o.amount += item.price * item.count
                    }
                })
                return o
            }
    },

})

//导入格式化时间插件
import moment from 'moment'
//定义全局时间过滤器
Vue.filter('dateFormat',function(dataStr,pattern = "YYYY-MM-DD HH:mm:ss"){
    return moment(dataStr).format(pattern)
})

// 设置请求的根路径
Vue.http.options.root = 'http://www.liulongbin.top:3005';
//全局设置post时候表单数据格式组织形式
Vue.http.options.emulateJSON = true;
//2.2使用vue-resource的this.$http.get获取数据
//2.3获取到的数据保存到data中
//2.4使用v-for循环渲染每个item项

var vm = new Vue({
    el:'#app',
    render:c=>c(app),    //渲染组件
    router,               //1.3挂载路由对象到vm实例上
    store                 //挂载store状态管理对象
})