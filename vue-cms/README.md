# 这是一个NB的项目

## 牛不牛逼， 用心去感受，每一行代码中的诗情雅意

### 我们是有灵魂程序员，所以，我们的代码富有诗意；

#### 丫的，实在编不下去了,哈哈哈

## [主流开源协议之间有何异同？](https://www.zhihu.com/question/19568896)

## 用(传统方式)命令行把修改过后的代码上传到码云？？？
1. git add .
2. git commit -m "提交信息"
3. git push

## 制作首页App组件
1. 完成 Header 区域，使用的是 Mint-UI 中的Header组件
2. 制作底部的 Tabbar 区域，使用的是 MUI 的 Tabbar.html
 + 在制作 购物车 小图标的时候，操作会相对多一些：
 + 先把 扩展图标的 css 样式，拷贝到 项目中
 + 拷贝 扩展字体库 ttf 文件，到项目中
 + 为 购物车 小图标 ，添加 如下样式 `mui-icon mui-icon-extra mui-icon-extra-cart`
3. 要在 中间区域放置一个 router-view 来展示路由匹配到的组件

## 改造 tabbar 为 router-link

## 设置路由高亮

## 点击 tabbar 中的路由链接，展示对应的路由组件

## 制作首页轮播图布局

## 加载首页轮播图数据
1. 获取数据， 如何获取呢， 使用 vue-resource
2. 使用 vue-resource 的 this.$http.get 获取数据
3. 获取到的数据，要保存到 data 身上
4. 使用 v-for 循环渲染 每个 item 项

## 改造 九宫格 区域的样式

## 改造 新闻资讯 路由链接

## 新闻资讯 页面 制作
1、绘制界面,使用Mui的media-list页面
2、使用vue-resource获取数据
    2.1:在main.js中vue-resource全局配置api地址
3、渲染真实数据
    3.1：定义全局时间过滤器

##实现新闻资讯列表点击跳转到新闻详情
1、把列表中的每一项改造为router-link，同时，在跳转的时候提供唯一id标识符
2、创建新闻详情的组件页面NewsInfo.vue
3、在路由模块中，将新闻详情的路由地址和组件对应起来

##实现新闻详情的页面布局和数据渲染

##单独封装一个comment.vue评论子组件
1、先创建一个单独的comment.vue组件模板
2、在需要使用comment组件的页面中，先手动导入comment组件
    +·important comment from './comment.vue'·
3、在父组件中，使用`components`属性,将刚才导入comment组件，注册为自己的子组件
4、将注册子组件时候的，注册名称，以标签形式，在页面中引用即可

##获取所有的评论数据显示到页面中
1、父组件向子组件传值(父组件绑定参数:,子组件props接收传值)
2、接收到父组件传值,然后进行url的拼接

##实现点击加载更多评论的功能
1、为加载更多绑定按钮，绑定点击事件，在事件中，请求下一页数据
2、点击加载更多，让pageIndex++，然后重新调用getComments()方法重新获取最新一页的数据
3、为了防止点击加载更多方法时，新数据覆盖老数据，在点击加载更多时，使用数组的concat方法拼接上新数组

##发表评论
1、把文本框做双向数据绑定
2、为发表按钮绑定一个事件
3、检验评论内容是否为空，如果为空，则Toast提示用户评论内容不能为空
4、通过vue-resource发送一个请求，把评论内容提交给服务器
5、当发表评论ok后，重新刷新列表，以查看最新评论
    +如果调用getComments方法重新刷新评论列表的话，可能只能得到最后一页的评论，前几页的评论获取不到
    +换一种思路：当评论成功后，在客户端，手动拼接出一个最新的评论对象，然后调用数组的unshift方法,
    把最新的评论追加到data中comments的开头；这样就能完美实现刷新评论的需求

##改造图片分析按钮为路由的链接并显示对应的组件页面

##绘制图片列表组件页面结构并美化样式
1、制作顶部的滑动条
2、制作底部的图片列表
##制作顶部滑动条的坑们：
1、需要借助于MUI中的tab-top-webview-main.html
2、需要把slider区域的mui-fullscreen类去掉
3、滑动条无法正常触发滑动，通过检查官方文档，发现这是JS组件，需要被初始化一下；
    +导入mui.js
    +调用官方提供的方式去初始化；
    mui('.mui-scroll-wrapper').scroll({
	    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
4、我们在初始化滑动条时，导入的mui.js，但是控制台报错:''Uncaught TypeError: 'caller', 'callee', 
   and 'arguments' properties may not be accessed on strict mode
   原因：mui.js中用到了caller,callee,arguments东西,但是webpack打包的bundle.js里的代码默认是开启严格模式的，
   所有二者发生冲突
   解决方法:使用插件babel-plugin-transform-remove-strict-mode移除严格模式
   滑动的时候警告--CSS 属性：touch-action，解决移动端点击事件延迟
5、刚进入图片分享页面的时候，滑动条无法正常工作，如果要初始化滑动条，必须要等Dom元素加载完毕，所以把滑动条代码放到mounted中
6、当滑动条调试ok后，发现，tabbar无法正常工作了，把每个tabbar按钮的样式中“mui-tab-item”重新改下名字
7、获取所有分类，并渲染分类列表
##制作图片列表区域
1、图片列表需要使用懒加载技术，我们可以使用Mint-UI提供的组件`lazy-load`
2、根据`lazy-load`的使用文档尝试使用
3、渲染图片列表数据
###实现了图片列表的懒加载改造和样式美化

###实现了点击图片跳转到详情页面
1、在改造li成router-link的时候，需要使用tag属性指定要渲染为哪种元素

###实现了详情页面的布局和美化，同时获取数据渲染页面

###实现图片详情中缩略图的功能
1、使用插件vue-preview这个缩略图插件
2、获取到所有的图片列表，然后使用v-for指令渲染]
3、注意：img标签上的class不能去掉
4、注意：每个图片数据对象中，必须有w,h属性

###绘制商品列表 页面结构并美化
1、商品经典两列布局:
    display:flex;
    justify-content: space-between;
    