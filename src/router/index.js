import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { title: '首页', icon: 'HomeFilled' }
      },
      {
        path: 'accounts',
        name: 'Accounts',
        component: () => import('../views/Accounts.vue'),
        meta: { title: '账号绑定', icon: 'ChatDotRound', requiresAuth: true }
      },
      {
        path: 'settings/engine',
        name: 'EngineSettings',
        component: () => import('../views/EngineSettings.vue'),
        meta: { title: '投注策略', icon: 'Lightning', requiresAuth: true }
      },
      {
        path: 'preferences',
        name: 'Preferences',
        component: () => import('../views/Preferences.vue'),
        meta: { title: '偏好配置', icon: 'Setting', requiresAuth: true }
      },
      {
        path: 'bets',
        name: 'Bets',
        component: () => import('../views/Bets.vue'),
        meta: { title: '投注记录', icon: 'Tickets', requiresAuth: true }
      },
      {
        path: 'backtest',
        name: 'Backtest',
        component: () => import('../views/Backtest.vue'),
        meta: { title: '策略回测', icon: 'Histogram', requiresAuth: true }
      },
      {
        path: 'help',
        name: 'Help',
        component: () => import('../views/Help.vue'),
        meta: { title: '帮助中心', icon: 'QuestionFilled' }
      },
      {
        path: 'member',
        name: 'Member',
        component: () => import('../views/Member.vue'),
        meta: { title: '会员信息', icon: 'User', requiresAuth: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
    ? `${to.meta.title} - Telegram 云飞投`
    : 'Telegram 云飞投 - 云端 Telegram 自动投注控制台'

  const isLoggedIn = localStorage.getItem('bet:token')
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ path: '/login', query: { next: to.fullPath } })
  } else if (isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
