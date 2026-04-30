/**
 * @op/config - 共享配置入口
 *
 * 统一导出ESLint和Prettier配置，供各子项目引用。
 */

const eslintConfig = require('./eslint-config.js');
const prettierConfig = require('./prettier-config.js');

module.exports = {
  eslint: eslintConfig,
  prettier: prettierConfig,
};
