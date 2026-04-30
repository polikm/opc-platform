/**
 * @op/config - Prettier共享配置
 *
 * OPC平台统一的代码格式化规则，供各子项目引用。
 * 使用方式：在项目的 .prettierrc.js 中引入此配置。
 */

module.exports = {
  // 缩进：2个空格
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  // 分号
  semi: true,

  // 引号：单引号
  singleQuote: true,

  // 尾随逗号
  trailingComma: 'all',

  // 大括号间距
  bracketSpacing: true,

  // JSX大括号
  jsxSingleQuote: false,
  jsxBracketSameLine: false,

  // 箭头函数参数括号
  arrowParens: 'always',

  // 换行符
  endOfLine: 'lf',

  // 行尾空行
  proseWrap: 'preserve',

  // HTML空格敏感度
  htmlWhitespaceSensitivity: 'css',

  // 插入Pragma
  insertPragma: false,

  // 要求Pragma
  requirePragma: false,

  // Vue文件缩进
  vueIndentScriptAndStyle: false,

  // 单属性HTML标签换行
  singleAttributePerLine: false,
};
