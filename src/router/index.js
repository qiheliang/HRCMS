import Vue from 'vue'
import Router from 'vue-router'
const frame = resolve => require(['@/framework/frame.vue'], resolve);
const login = resolve => require(['@/pages/login/login.vue'], resolve);
const index = resolve => require(['@/pages/index/index.vue'], resolve);
const authorization = resolve => require(['@/pages/authorization/authorization.vue'], resolve);
const accountNumber = resolve => require(['@/pages/authorization/accountNumber.vue'], resolve);
const invitation = resolve => require(['@/pages/invitation/invitation.vue'], resolve);

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'frame',
      component: frame,
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: 'index',
          component: index
        },
        {
          path: '/authorization',
          name: 'authorization',
          component: authorization
        },
        {
          path: '/accountNumber',
          name: 'accountNumber',
          component: accountNumber
        },
        {
          path: '/invitation',
          name: 'invitation',
          component: invitation
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})
