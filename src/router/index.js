import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import Home from "@/components/Home";

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login'},
    { path: '/login', component:Login },
    { path: '/home', component:Home },
]

const router = new VueRouter({
  routes
})

export default router
