
// Electron Builder configuration
export default {
  appId: "com.flowtastic.app",
  productName: "Flowtastic",
  directories: {
    output: "release",
    buildResources: "build",
  },
  files: [
    "dist/**/*",
    "electron/**/*",
    "!**/node_modules/**/*",
    {
      from: ".",
      filter: ["electron/main.cjs", "electron/preload.cjs"]
    }
  ],
  extraMetadata: {
    main: "electron/main.cjs"
  },
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
