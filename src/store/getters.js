const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,

  // 添加代理、会员 ===== 是否成功状态
  EDIT_MEMBER_OK: state => state.ht.edit_member_ok,
  // 添加自己的代理、会员 ===== 是否成功状态
  EDIT_MY_MEMBER_OK: state => state.ht.edit_my_member_ok,
  // 修改自己的密码 ===== 是否成功状态
  EDIT_PASSWORD_OK: state => state.ht.edit_pw_ok,
  // 代理、会员上下分====是否成功状态
  UPDOWN_OK: state => state.ht.updown_ok,
  // 设定代理、会员====是否成功状态
  MODIFY__OK: state => state.ht.modify_ok,
  // 搜索会员，数据变化状态
  SEARCH_MEMBER_OK: state => state.ht.search_member_ok
}
export default getters
