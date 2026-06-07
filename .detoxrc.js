/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    // Native projects are generated on demand with `expo prebuild`.
    // The iOS scheme/workspace name ("Checkit") is derived from the app
    // name and is stable across prebuilds.
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/Checkit.app',
      build:
        'xcodebuild -workspace ios/Checkit.xcworkspace -scheme Checkit -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      reversePorts: [8081],
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        // Adjust to any installed simulator (see `xcrun simctl list devices`).
        type: 'iPhone 17',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        // Adjust to an existing AVD (see `emulator -list-avds`).
        avdName: 'Pixel_7_API_34',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
  },
};
