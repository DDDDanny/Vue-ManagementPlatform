import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 挂载为Vue上的属性
Vue.prototype.$message = Message

// 注册组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
