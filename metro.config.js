const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const reviewModule = moduleName === '../../services/dhikrReviewContent' &&
    /[/\\]DhikrReadingHelp\.tsx$/.test(context.originModulePath);
  return context.resolveRequest(context, reviewModule && context.dev ? `${moduleName}.dev` : moduleName, platform);
};

module.exports = config;
