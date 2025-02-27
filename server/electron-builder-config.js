
/**
 * Конфигурация для electron-builder
 * Отключает проверку подписи кода и использование символических ссылок
 */
module.exports = {
  appId: "com.flowtastic.server",
  productName: "Flowtastic Server",
  win: {
    target: ["portable"],
    icon: "build/icon.ico"
  },
  portable: {
    artifactName: "FlowtasticServer.exe"
  },
  directories: {
    output: "dist",
    buildResources: "build"
  },
  files: [
    "**/*",
    "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
    "!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
    "!**/node_modules/*.d.ts",
    "!**/node_modules/.bin",
    "!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}",
    "!.editorconfig",
    "!**/._*",
    "!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}",
    "!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}",
    "!**/{appveyor.yml,.travis.yml,circle.yml}",
    "!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}"
  ],
  // Важные настройки для обхода проблемы с символическими ссылками
  asar: false,
  forceCodeSigning: false,
  npmRebuild: false,
  // Отключение использования winsign для предотвращения ошибки символических ссылок 
  win: {
    sign: null,
    verifyUpdateCodeSignature: false,
    signAndEditExecutable: false
  },
  extraMetadata: {
    main: "main.js"
  }
};
