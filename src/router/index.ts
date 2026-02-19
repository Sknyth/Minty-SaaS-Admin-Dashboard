import { createMemoryHistory, createRouter } from 'vue-router'

import supabase from '../supabase'

import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'

const routes = [
  { path: '/', component: Dashboard, name: 'Dashboard' },
  { path: '/login', component: Login, name: 'Login', meta: { notAuth: true } },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const isAuth = !!session

  if (!to.meta?.notAuth && !isAuth) {
    return next('/login')
  }
  if (to.meta?.notAuth && isAuth) {
    return next('/')
  }

  next()
})

export default router