import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 记录激活的路由
  window.sessionStorage.setItem('activePath', to.path)
  // 去往login页面放行
  if (to.path === '/login') {
    next()
    return
  }
  // 非login页面判断是否有登陆处于登陆状态，登陆的token
  if (!window.sessionStorage.getItem('token')) {
    router.push('/login')
    return
  }
  // 非login页面, 且有登陆状态凭证token
  next()
})

export default router
