# rap_common
rap_common 1688 rap 公共组件
#picker使用
##params 参数
 onClick 点击确定后的返回事件 function (v){
    //v 选中的值 int || array
} 
 headtext 标题 string
 mode 模式 multiple || single
 datasource 数据数组  格式  不带子标题 [string|int,....] 
                           带子标题   [{par:string/int,sub:string/int},...]
##使用方法
 <Picker ref='picker' ...props/>
 this.refs.picker.show()
#Modal使用方法
  食用方法，引入 Madal ，在容器中渲染 Modal.AyDialog ，并添加ref
  ##demo 
  import { Modal } from '...'
  render(<Modal.AyDialog ref='demo'>)
  Modal.alert({element:this.refs.demo,...})
 @Method Modal.alert
 ## Modal.alert() params 参数说明
 *element node 必传,不然只能显示默认
 type string  normal/AD  是普通弹框还是广告弹框
 pic_url url 图片地址
 link url 跳转的页面
 header/body/font string/node  可以传dom
 contstyle obj 样式对象
 onClick => 确认方法
 onCancel => 取消方法