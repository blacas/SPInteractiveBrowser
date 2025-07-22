const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    name: 'Secure Remote Browser',
    appBundleId: 'com.securebrowser.app',
    // Support multiple architectures
    osxUniversal: {
      mergeASARs: false,
    },
    // Disable code signing completely for development
    osxSign: false,
    osxNotarize: false,
    // Additional options for unsigned builds
    ignore: [
      /\.DS_Store$/,
      /node_modules/
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'secure_remote_browser',
        authors: 'Versatile Technologies',
        description: 'Secure Remote Browser with VPN capabilities and 1Password integration'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'bilalmohib',           
          name: 'AussieVaultBrowser',    
        },
        prerelease: false,
        draft: true,
        generateReleaseNotes: true,
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
