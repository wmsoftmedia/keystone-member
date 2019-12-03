export const standard = {
  white: "#fff",
  black: "#000",
  red: "#ff0000",
  green: "#00ff00",
  gray: "#eaeaee",
  gray2: "#eeeeee",
  lightGray: "#f9f9f9",
  white5: "rgba(255,255,255,0.05)",
  white10: "rgba(255,255,255,0.1)",
  white20: "rgba(255,255,255,0.2)",
  white30: "rgba(255,255,255,0.3)",
  white40: "rgba(255,255,255,0.4)",
  white50: "rgba(255,255,255,0.5)",
  white60: "rgba(255,255,255,0.6)",
  white70: "rgba(255,255,255,0.7)",
  white80: "rgba(255,255,255,0.8)",
  white90: "rgba(255,255,255,0.9)",
  black10: "rgba(0,0,0,0.10)",
  black15: "rgba(0,0,0,0.15)",
  black20: "rgba(0,0,0,0.2)",
  black30: "rgba(0,0,0,0.3)",
  black50: "rgba(0,0,0,0.5)",
  black40: "rgba(54, 60, 68, 0.4)",
  black06: "rgba(0,0,0,0.06)",
  coal15: "rgba(54, 60, 68, 0.15)",
  transparent: "transparent",
};

export const shadows = {
  shadow: standard.black,
};

export const primary = {
  blue1: "#48b6ea",
  blue2: "#139ed8",
  blue3: "#148ecd",
  blue4: "#2282b4",
  blue5: "#196e9d",
  blue6: "#1e5475",
  blue7: "#1a4a68",
  blue8: "#143a53",
  blue9: "#12354C",
  blue_30: "rgba(25, 110, 157, 0.3)",
  blue_50: "rgba(25, 110, 157, 0.5)",
};

export const secondary = {
  // Orange
  orange: "#eb7d1a",
  blue15: "#e1eafa",
  skyBlue15: "#e8f3fc",
  black: "#363c44",
  black48: "#9fa1a5",
  black24: "#cfd0d2",
  black24_20: "rgba(207,208,210,0.2)",
  black12: "#e7e8e9",
  black9: "#ededee",
  black6: "#f3f3f4",
  black3: "#f9f9f9",
  coal_15: "#184460",
  charcoal: "#363c44",
  charcoal_15: "rgba(54, 60, 68, 0.15)",
  charcoal_70: "rgba(54, 60, 68, 0.7)",
};

export const tertiary = {
  warningRed: "#e31413",
  alertAmber: "#f9ae14",
  goGreen: "#3fab35",
};

export const keystone = {
  ...primary,
  ...secondary,
  ...tertiary,
};

export const app = {
  primary1: keystone.blue1,
  primary2: keystone.blue2,
  primary3: keystone.blue3,
  primary4: keystone.blue4,
  primary5: keystone.blue5,
  primary6: keystone.blue6,
};

export const macros = {
  protein: keystone.alertAmber,
  fat: keystone.orange,
  carbs: keystone.warningRed,
};

export const sections = {
  home: app.primary2,
  body: app.primary2,
  progress: app.primary2,
  nutrition: app.primary2,
  training: app.primary2,
  profile: app.primary2,
};

export const system = {
  headerBg: standard.gray,
  headerBg2: app.primary2,
  headerFg: standard.black,
  headerFg2: standard.white,

  tileSeq1: standard.white,
  tileSeq2: secondary.black3,
  tileSeq3: secondary.black6,
  tileSeq4: secondary.black9,

  tabBarBg: keystone.black6,
  tabInactive: keystone.black24,

  listItemBg1: standard.white,
  listItemSeparator: keystone.black6,

  errorTitle: standard.white,
  errorText: standard.white,

  iconForward: keystone.black24,
  touchHighlight: standard.gray,

  warning: keystone.warningRed,
  alert: keystone.alertAmber,
  success: keystone.goGreen,

  textInputLight: standard.white,
  textInputDark: keystone.blue5,
  textInputBg1: app.primary1,
  textInputBgDark: standard.black15,
  textInputUnderline: app.primary3,

  textLight: app.primary5,
  textDark: standard.white,

  buttonPrimary: app.primary5,
  buttonPopupPrimary: app.primary2,

  gaugeNeedle: app.primary2,

  loaderLight: standard.white,
  loaderDark: app.primary5,
};

export const metricColors = {
  nutrition: standard.white,
  gratitude: standard.white,
  body_weight: standard.white,

  training: secondary.black3,
  motivation: secondary.black3,
  bfp: secondary.black3,

  smm: secondary.black6,
  stress_optimization: secondary.black6,

  skin_folds: secondary.black9,
  sleep: secondary.black9,
  circumference: secondary.black9,
};

export default {
  ...standard,
  ...keystone,
  ...macros,
  ...sections,
  ...app,
  ...system,
  metricColors,
};
