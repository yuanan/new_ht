/** When your routing manageUser is too long, you can split it into small modules **/

import Layout from '@/layout'

const manageUserRouter = {
  path: '/manageUser',
  component: Layout,
  redirect: '/manageUser/complex-manageUser',
  name: 'ManageUser',
  meta: {
    title: 'ManageUser',
    icon: 'peoples'
  },
  children: [
    // {
    //   path: 'management',
    //   component: () => import('@/views/manage-user/management/index'),
    //   name: 'Management',
    //   meta: { title: 'Management' }
    // },
    {
      path: 'agent-list',
      component: () => import('@/views/manage-user/agent-list/index'),
      name: 'AgentsList',
      meta: { title: 'AgentsList' }
    },
    {
      path: 'member-list',
      component: () => import('@/views/manage-user/member-list/index'),
      name: 'MembersList',
      meta: { title: 'MembersList' }
    },
    {
      path: 'player-total-list',
      component: () => import('@/views/manage-user/player-total-list/index'),
      name: 'PlayerTotalList',
      meta: { title: 'PlayerTotalList' }
    },
    {
      path: 'agent-total-list',
      component: () => import('@/views/manage-user/agent-total-list/index'),
      name: 'agentTotalList',
      meta: { title: 'AgentTotalList' }
    }
  ]
}
export default manageUserRouter
