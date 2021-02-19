/* eslint-disable */
export default {
  // 个人信息
  optioner: {
    UserName: '',
    Id: '',
    arrJsb: [],
    optionScore: 0,
    xmb_s: '',
    xmb_d: '',
    zcb: '',
    gx: '',
    xmType: '',
    level: 2,
    webSit: '',
    token: '',
    pw: '',
    enable: 1,
    customerId: ''
  },
  // 修改新密码后覆盖原始密码
  newPass: '',
  // 用于判断原始密码
  Pass: '',
  // 是否是万利的代理
  isWL: false,
  // 用于判断等级，是否可设置 洗码类型（单、双）
  gxLength: 0,
  selectInfo: {
    selectAgent: '',
    selectItem: '',
    xmb_d: '',
    xmb_s: ''
  },
  addPwStr: '$hn_ok$my_ok$hn_ok',
  // 协议加密 ==> '秘钥key必须是 8的倍数位', '位移iv 为了兼容 PHP 所以用 16位' 
  en: {
    key: '@hKe9@A1lKe9$Tz1kE@8HnG7',
    iv: '1234567890123456'
  },
  // 表格头部自定义样式
  tableHeaderColor: { color:'#fff', background: '#1565C0' },
  // 返回顶部样式
  myBackToTopStyle: {
    right: '50px',
    bottom: '50px',
    width: '40px',
    height: '40px',
    'border-radius': '4px',
    'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
    background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
  }
}
