import { RouteRecordRaw } from 'vue-router'

const Layout = (): unknown => import('../components/layout/index.vue')
const Login = (): unknown => import('../views/login/index.vue')
const User = (): unknown => import('../views/user/index.vue')
const Article = (): unknown => import('../views/article/index.vue')
const Feedback = (): unknown => import('../views/feedback/index.vue')
const Notice = (): unknown => import('../views/notice/index.vue')
const Expenditure = (): unknown => import('../views/expenditure/index.vue')
const Income = (): unknown => import('../views/income/index.vue')

export const routes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    component: Layout,
    children: [
      {
        path: 'user',
        component: User
      },
      {
        path: 'article',
        component: Article
      },
      {
        path: 'feedback',
        component: Feedback
      }
    ]
  },
  {
    name: 'Login',
    path: '/login',
    component: Login
  },
  {
    name: 'donation',
    path: '/donation',
    component: Layout,
    redirect: '/donation/notice',
    children: [
      {
        path: 'notice',
        component: Notice
      },
      {
        path: 'expenditure',
        component: Expenditure
      },
      {
        path: 'income',
        component: Income
      }
    ]
  }
]
