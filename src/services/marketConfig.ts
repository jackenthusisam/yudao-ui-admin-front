export const marketConfig = {
  contactPhone: import.meta.env.VITE_MARKET_CONTACT_PHONE || '400-888-9999',
  contactWechat: import.meta.env.VITE_MARKET_CONTACT_WECHAT || 'xiangmusc',
  contactEmail: import.meta.env.VITE_MARKET_CONTACT_EMAIL || 'service@xiangmusc.com',
  workTime: import.meta.env.VITE_MARKET_WORK_TIME || '9:00-18:00',
  registerText: '填写租户、账号、昵称和密码即可注册，注册参数与 Yudao 原后台注册接口保持一致。',
  openingSteps: [
    '在项目商城选择适合的招商项目',
    '加入购物车并确认需要开通的项目',
    '提交订单或联系顾问完成开通资料确认',
    '在已购商品中查看已完成交易和后续交付信息',
  ],
}
