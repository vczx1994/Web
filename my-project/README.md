### mpvue 
1. VM860:1 navigateTo:fail page "pages/detail/main?id=12" is not found  
  在app.json里面pages数组加入pagePath
2. 获取不到后端返回的数据，检查请求接口正确
3. 前端获取到的数据是后端返回的变量
4. 将数组chunk为二维数组---.chunk(arr,size)
5. thirdScriptError
Cannot read property 'msg' of undefined;at api request success callback function
TypeError: Cannot read property 'msg' of undefined
 获取后端数据的字段不一致报错
6. 前端数据显示不出来:数据处理取值不对
7. Module build failed: TypeError: unknown: Cannot read property 'forEach' of undefined  
  components里是对象
8. 小程序下拉不生效:  app.json里面window配置
  'enablePullDownRefresh': true
9. 小程序分享需要在每个页面设置  
   onShow () {  
        wx.showShareMenu()  
   }