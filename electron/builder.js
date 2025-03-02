
const path = require('path');

/**
 * Electron Builder configuration
 */
module.exports = {
  appId: "com.flowtastic.app",
  productName: "Flowtastic",
  directories: {
    output: "release",
    buildResources: "build",
  },
  files: [
    "dist/**/*",
    "electron/**/*",
  ],
  mac: {
    category: "public.app-category.productivity",
    target: [
      "dmg",
      "zip"
    ],
    icon: "build/icon.icns"
  },
  win: {
    target: [
      "nsis",
      "portable"
    ],
    icon: "build/icon.ico"
  },
  linux: {
    target: [
      "AppImage",
      "deb"
    ],
    category: "Utility",
    icon: "build/icon.png"
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true
  }
};
