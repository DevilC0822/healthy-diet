import Key from '../i18nKey';
import { Translation } from '@/i18n';

export const zh_cn: Translation = {
  [Key.appName]: '配料',

  [Key.login]: '登录',
  [Key.logout]: '退出',
  [Key.loginDesc]: '请输入用户名和密码',
  [Key.registerDesc]: '立即注册，享受更多服务',
  [Key.username]: '用户名',
  [Key.usernamePlaceholder]: '请输入用户名',
  [Key.password]: '密码',
  [Key.passwordPlaceholder]: '请输入密码',
  [Key.confirmPassword]: '确认密码',
  [Key.confirmPasswordPlaceholder]: '请确认密码',
  [Key.register]: '注册',
  [Key.noAccountTip]: '没有账号？',
  [Key.hasAccountTip]: '已有账号？',
  [Key.dark]: '暗黑',
  [Key.light]: '明亮',

  // databoard
  [Key.databoardTitle]: '数据看板',
  [Key.tokenUsagesTitle]: 'Token 使用量',
  [Key.ingredientInCountTitle]: '配料入库量',
  [Key.tokenTotal]: '全部',
  [Key.tokenPrompt]: '输入',
  [Key.tokenCompletion]: '输出',
  [Key.inTypeTotal]: '全部',
  [Key.inTypeInput]: '手动查询',
  [Key.inTypeRecognize]: '图片识别',
  [Key.typeDistributionTimes]: '配料类型分布 - 次数',
  [Key.typeDistributionCount]: '配料类型分布 - 数量',
  [Key.tabKeyAll]: '全部',
  [Key.tabKey6Months]: '近 6 个月',
  [Key.tabKey3Months]: '近 3 个月',
  [Key.tabKey30Days]: '近 30 天',
  [Key.tabKey7Days]: '近 7 天',
  [Key.tabKey3Days]: '近 3 天',

  // resource
  [Key.resourceTitle]: '配料资源库',
  [Key.ingredientName]: '配料名称',
  [Key.ingredientNamePlaceholder]: '请输入配料名称',
  [Key.inType]: '入库方式',
  [Key.inSourceModel]: '入库模型',
  [Key.optionAll]: '全部',
  [Key.btnSearch]: '搜索',
  [Key.btnReset]: '重置',
  [Key.ingredientDescription]: '描述',
  [Key.ingredientCount]: '入库次数',
  [Key.createdAt]: '创建时间',
  [Key.updatedAt]: '更新时间',

  // recognize
  [Key.recognizeTitle]: '配料识别',
  [Key.model]: '模型',
  [Key.changeModel]: '更换模型',
  [Key.uploadDescTitle]: '上传说明',
  [Key.uploadDescTip]: '支持{{type}}格式，大小不超过{{size}}MB',
  [Key.btnUpload]: '上传',
  [Key.productName]: '商品名称',
  [Key.btnReUpload]: '重新上传',

  // modelLibrary
  [Key.modelLibraryTitle]: '模型库',
  [Key.website]: '官网',

  // ingredientSearch
  [Key.ingredientSearchTitle]: '配料搜索',

  // usage
  [Key.usageTitle]: '使用记录',
  [Key.productNamePlaceholder]: '请输入产品名称',
  [Key.id]: 'ID',
  [Key.usage]: 'Token使用量',
  [Key.createBy]: '创建人',
  [Key.usageList]: '使用记录',

  // user
  [Key.userManagementTitle]: '用户管理',
  [Key.role]: '角色',
  [Key.userList]: '用户列表',
  [Key.action]: '操作',
  [Key.editUser]: '编辑',
  [Key.deleteUser]: '删除',
  [Key.deleteUserTip]: '确定删除该用户吗？',
  [Key.cancel]: '取消',
  [Key.confirm]: '确定',
  [Key.admin]: '管理员',
  [Key.onlyReadAdmin]: '只读管理员',
  [Key.user]: '普通用户',

  // menu
  [Key.menuDataboard]: '数据看板',
  [Key.menuResource]: '配料资源库',
  [Key.menuIngredientRecognize]: '配料识别',
  [Key.menuIngredientSearch]: '配料搜索',
  [Key.menuModelLibrary]: '模型库',
  [Key.menuUsage]: '使用记录',
  [Key.menuUserManagement]: '用户管理',

  // Toast
  [Key.recognizeFail]: '识别失败',
  [Key.selectImageFail]: '选择图片失败',
  [Key.selectImageFailTip]: '请重试或选择其他图片',
  [Key.searchFail]: '搜索失败',
  [Key.searchFailTip]: '请输入正确的配料名称',
  [Key.ingredientNameRequired]: '请输入配料名称',
  [Key.ingredientNameRequiredTip]: '请输入配料名称',
};

export default zh_cn;
