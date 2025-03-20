import Key from '../i18nKey';
import { Translation } from '@/i18n';

export const en_US: Translation = {
  [Key.appName]: 'Ingredient',

  [Key.login]: 'Login',
  [Key.logout]: 'Logout',
  [Key.loginDesc]: 'Please enter your username and password',
  [Key.registerDesc]: 'Register now to enjoy more services',
  [Key.username]: 'Username',
  [Key.usernamePlaceholder]: 'Please enter your username',
  [Key.password]: 'Password',
  [Key.passwordPlaceholder]: 'Please enter your password',
  [Key.confirmPassword]: 'Confirm Password',
  [Key.confirmPasswordPlaceholder]: 'Please confirm your password',
  [Key.register]: 'Register',
  [Key.noAccountTip]: 'No account?',
  [Key.hasAccountTip]: 'Has account?',

  [Key.dark]: 'Dark',
  [Key.light]: 'Light',

  // databoard
  [Key.databoardTitle]: 'DataBoard',
  [Key.tokenUsagesTitle]: 'Token Usage',
  [Key.ingredientInCountTitle]: 'Ingredient In Count',
  [Key.tokenTotal]: 'Total',
  [Key.tokenPrompt]: 'Prompt',
  [Key.tokenCompletion]: 'Completion',
  [Key.inTypeTotal]: 'Total',
  [Key.inTypeInput]: 'Input',
  [Key.inTypeRecognize]: 'Recognize',
  [Key.typeDistributionTimes]: 'Type Distribution - Times',
  [Key.typeDistributionCount]: 'Type Distribution - Count',
  [Key.tabKeyAll]: 'All',
  [Key.tabKey6Months]: 'Last 6 Months',
  [Key.tabKey3Months]: 'Last 3 Months',
  [Key.tabKey30Days]: 'Last 30 Days',
  [Key.tabKey7Days]: 'Last 7 Days',
  [Key.tabKey3Days]: 'Last 3 Days',

  // resource
  [Key.resourceTitle]: 'Ingredient Resource Library',
  [Key.ingredientName]: 'Ingredient Name',
  [Key.ingredientNamePlaceholder]: 'Please enter the ingredient name',
  [Key.inType]: 'In-Type',
  [Key.ingredientType]: 'Ingredient Type',
  [Key.inSourceModel]: 'Ingredient Source Model',
  [Key.optionAll]: 'All',
  [Key.btnSearch]: 'Search',
  [Key.btnReset]: 'Reset',
  [Key.ingredientDescription]: 'Description',
  [Key.ingredientCount]: 'Ingredient Count',
  [Key.createdAt]: 'Created At',
  [Key.updatedAt]: 'Updated At',

  // recognize
  [Key.recognizeTitle]: 'Ingredient Recognition',
  [Key.model]: 'Model',
  [Key.changeModel]: 'Change Model',
  [Key.uploadDescTitle]: 'Upload Description',
  [Key.uploadDescTip]: 'Support {{type}} format, size is less than {{size}}MB',
  [Key.btnUpload]: 'Upload',
  [Key.productName]: 'Product Name',
  [Key.btnReUpload]: 'Re Upload',

  // modelLibrary
  [Key.modelLibraryTitle]: 'Model Library',
  [Key.website]: 'Website',

  // ingredientSearch
  [Key.ingredientSearchTitle]: 'Ingredient Search',

  // usage
  [Key.usageTitle]: 'Usage Record',
  [Key.productNamePlaceholder]: 'Please enter the product name',
  [Key.id]: 'ID',
  [Key.usage]: 'Token Usage',
  [Key.createBy]: 'Created By',
  [Key.usageList]: 'Usage List',

  // user
  [Key.userManagementTitle]: 'User Management',
  [Key.role]: 'Role',
  [Key.userList]: 'User List',
  [Key.action]: 'Action',
  [Key.editUser]: 'Edit',
  [Key.deleteUser]: 'Delete',
  [Key.deleteUserTip]: 'Are you sure you want to delete this user?',
  [Key.cancel]: 'Cancel',
  [Key.confirm]: 'Confirm',
  [Key.admin]: 'Admin',
  [Key.onlyReadAdmin]: 'Only Read Admin',
  [Key.user]: 'User',

  // menu
  [Key.menuDataboard]: 'DataBoard',
  [Key.menuResource]: 'Ingredient Resource Library',
  [Key.menuIngredientRecognize]: 'Ingredient Recognition',
  [Key.menuIngredientSearch]: 'Ingredient Search',
  [Key.menuModelLibrary]: 'Model Library',
  [Key.menuUsage]: 'Usage Record',
  [Key.menuUserManagement]: 'User Management',

  // Toast
  [Key.recognizeFail]: 'Recognize Failed',
  [Key.selectImageFail]: 'Select Image Failed',
  [Key.selectImageFailTip]: 'Please try again or select another image',
  [Key.searchFail]: 'Search Failed',
  [Key.searchFailTip]: 'Please enter the correct ingredient name',
  [Key.ingredientNameRequired]: 'Ingredient Name Required',
  [Key.ingredientNameRequiredTip]: 'Please enter the ingredient name',
};

export default en_US;