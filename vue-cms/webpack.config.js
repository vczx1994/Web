// webpack配置文件代码基于node
var path = require('path')
// 在内存中指定模板页面，生成内存中的首页，同时将打包好的buble注入页面底部
// 将导出的对象挂在一个plugin节点
var htmlWebpackPlugin = require('html-webpack-plugin')

// 定义打包文件的入口、出口文件，检查项目配置文件，读取文件，
//取出配置对象，根据这个对象进行构建
module.exports = {
    mode: 'development',
    entry:path.join(__dirname,'./src/main.js'),  //入口文件
    output:{
        path:path.join(__dirname,'./dist'), //输出路径
        filename:'bundle.js'        //指定输出文件名称
    },
    plugins:[  //所有webpack插件配置节点
        new htmlWebpackPlugin({
            template:path.join(__dirname,'./src/index.html'),    //指定模板文件路径
            filename:'index.html'      //设置生成的内存页面名称
        })
    ],
    module:{    //配置第三方loader模块
        rules:[     //第三方匹配规则
            {test:/\.css$/,use:['style-loader','css-loader']}, //处理css文件的loader
            {test:/\.less$/,use:['style-loader','css-loader','less-loader']}, 
            {test:/\.scss$/,use:['style-loader','css-loader','sass-loader']},
            {test:/\.(jpg|png|gif|bmp|jpeg)$/,use:'url-loader?limit=81683&name=[hash:8]-[name].[ext]'},  //处理图片路径的loader
            //传参:limit给定的值是图片大小,单位是byte,如果引用的图片大于或等于给定limit值，则不会转为base64格式字符串，小于转为base64
            //name:图片名字 [hasj:8]：8位hash值区别命名重复显示 ext：图片后缀名
            {test:/\.(ttf|eot|svg|woff|woff2)$/,use:'url-loader'},  //处理字体文件loader
            {test:/\.js$/,use:'babel-loader',exclude:/node_modules/},  //配置Babel来转换高级的es语法
            {test:/\.vue$/,use:'vue-loader'}    //处理.vue文件loader

        ]   
    },
    resolve:{
        alias:{  //修改vue导入包的路径
            // "vue$":"vue/dist/vue.js"
        }
    }
}    
