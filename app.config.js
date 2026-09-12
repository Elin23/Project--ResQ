module.exports = () => {
  const googleMapsApiKey =
    process.env.GOOGLE_MAPS_API_KEY || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  const plugins = [
    "expo-font",
    "expo-localization",
    "@react-native-community/datetimepicker",
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "يستخدم ResQ موقعك لتحديد البلاغات ونقاط الإطعام والخدمات القريبة بدقة.",
      },
    ],
  ];

  if (googleMapsApiKey) {
    plugins.push([
      "react-native-maps",
      {
        androidGoogleMapsApiKey: googleMapsApiKey,
        iosGoogleMapsApiKey: googleMapsApiKey,
      },
    ]);
  }

  return {
    name: "ResQ",
    slug: "resq",
    scheme: "resq",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
    },

    android: {
      package: "com.ellinshaia.resq",
      icon: "./assets/images/android-app-icon.png",
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },

    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins,

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      supportsRTL: true,
      forcesRTL: true,
      eas: {
        projectId: "a2b9b740-0f52-4618-a4a6-a4de64aedbd3",
      },
    },

    locales: {},
  };
};