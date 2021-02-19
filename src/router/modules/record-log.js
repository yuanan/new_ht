/** When your routing manageUser is too long, you can split it into small modules **/

import Layout from '@/layout'

const recordLog = {
  path: '/recordsPage',
  component: Layout,
  redirect: '/recordsPage/complex-recordPage',
  name: 'RecordsPage',
  meta: {
    title: 'RecordsPage',
    icon: 'documentation'
  },
  children: [
    {
      path: 'login-records',
      component: () => import('@/views/record-log/login-record/index'),
      name: 'LoginRecords',
      meta: { title: 'LoginRecords' }
    },
    {
      path: 'access-records',
      component: () => import('@/views/record-log/up-down-record/index'),
      name: 'AccessRecords',
      meta: { title: 'AccessRecords' }
    },
    {
      path: 'account-change-records',
      component: () => import('@/views/record-log/account-change-record/index'),
      name: 'AccountChangeRecords',
      meta: { title: 'AccountChangeRecords' }
    }
  ]
}
export default recordLog
