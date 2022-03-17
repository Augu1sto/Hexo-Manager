import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'entry-page',
      component: require('@/components/Entry').default
    },
    {
      path: '/editor-page',
      name: 'editor-page',
      component: require('@/components/EditorPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
