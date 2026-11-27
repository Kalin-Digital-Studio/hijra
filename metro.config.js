const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const reviewModule = moduleName === '../../services/dhikrReviewContent' &&
    /[/\\]DhikrReadingHelp\.tsx$/.test(context.originModulePath);
  const waqfDiagnostic = moduleName === './QuranWaqfDiagnostic' &&
    /[/\\]QuranReader\.tsx$/.test(context.originModulePath);
  return context.resolveRequest(context, context.dev && (reviewModule || waqfDiagnostic) ? `${moduleName}.dev` : moduleName, platform);
};

module.exports = config;
