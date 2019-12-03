export const DASHBOARD_KEYS = [
  "bodyFatPercentage",
  "bodyWeight",
  "circumference",
  "skeletalMuscleMass"
]

export const MEASUREMENT_KEYS = [
  "bodyWeight",
  "bodyFatPercentage",
  "bodyFatMass",
  "skeletalMuscleMass",
  "sleepHours",
  "heartRateVar",
  "heartRate",
  "bodyTemp",
  "circumference"
  // "skinFolds",
  // "bloodPressure",
  // "menstrualDay",
]

export const SIMPLE_METRICS = [
  "bodyWeight",
  "bodyFatPercentage",
  "bodyFatMass",
  "skeletalMuscleMass",
  "sleepHours",
  "heartRate",
  "heartRateVar",
  "bodyTemp"
]
export const COMPLEX_METRICS = [
  "circumference"
  // "skinFolds",
  // "bloodPressure"
]

export const COMPLEX_PARTS = {
  circumference: ["neck", "chest", "abdomen", "hip", "rightArm", "rightThigh"],
  skinFolds: ["back", "quad", "tricep", "rightThigh"],
  bloodPressure: ["systole", "diastole"]
}

export const metricDisplay = ({ key: rawKey, ...rest }) => {
  const key = rawKey.toLowerCase()
  switch (key) {
    case "bodyweight":
    case "bodyfatpercentage":
    case "bodyfatmass":
    case "skeletalmusclemass":
    case "skinfolds":
    case "circumference":
    case "sleephours":
    case "bloodpressure":
    case "menstrualday":
    case "heartrate":
    case "heartratevar":
    case "bodytemp":
      return { ...DISPLAY_METRICS[key], key, rawKey, ...rest }

    default:
      return {
        ...DISPLAY_METRICS.unknown,
        key,
        label: key,
        rawKey,
        color: "red",
        ...rest
      }
  }
}

export const METRIC_TYPES = {
  WEIGHT: "WEIGHT",
  LENGTH: "LENGTH",
  PERCENT: "PERCENT",
  TEMPERATURE: "TEMPERATURE",
  HOURS: "HOURS",
  PRESSURE: "PRESSURE",
  HEART_RATE: "HEART_RATE",
  M_SECONDS: "M_SECONDS",
  BOOL: "BOOL",
  UNKNOWN: "UNKNOWN"
}

const skinFoldsParts = [
  { key: "back", label: "Back" },
  { key: "quad", label: "Quad" },
  { key: "tricep", label: "Tricep" },
  { key: "rightThigh", label: "Right Thigh" }
]

const circumferenceParts = [
  { key: "neck", label: "Neck" },
  { key: "chest", label: "Chest" },
  { key: "abdomen", label: "Abdomen" },
  { key: "hip", label: "Hip" },
  { key: "rightArm", label: "Right Arm" },
  { key: "rightThigh", label: "Right Thigh" }
]

const bloodPressureParts = [
  { key: "systole", label: "Systole" },
  { key: "diastole", label: "Diastole" }
]

const DISPLAY_METRICS = {
  bodyweight: {
    label: "Body Weight",
    abbrev: "BW",
    measure: "kg",
    type: METRIC_TYPES.WEIGHT,
    description: "",
    dbKey: "BODY_WEIGHT"
  },
  bodyfatpercentage: {
    label: "Body Fat %",
    abbrev: "BF%",
    measure: "%",
    type: METRIC_TYPES.PERCENT,
    description: "",
    dbKey: "BFP"
  },
  bodyfatmass: {
    label: "Body Fat Mass",
    abbrev: "BFM",
    measure: "kg",
    type: METRIC_TYPES.WEIGHT,
    description: "",
    dbKey: "BFM"
  },
  skeletalmusclemass: {
    label: "Sk. Muscle Mass",
    fullLabel: "Skeletal Muscle Mass",
    abbrev: "SMM",
    measure: "kg",
    type: METRIC_TYPES.WEIGHT,
    description: "",
    dbKey: "SMM"
  },
  skinfolds: {
    label: "Skin Folds",
    abbrev: "SF",
    measure: "mm",
    type: METRIC_TYPES.LENGTH,
    description: "",
    parts: skinFoldsParts,
    dbKey: "SKIN_FOLDS"
  },
  circumference: {
    shortLabel: "Circ.",
    label: "Circumference",
    abbrev: "CIRC",
    measure: "cm",
    type: METRIC_TYPES.LENGTH,
    description: "",
    parts: circumferenceParts,
    dbKey: "CIRCUMFERENCE"
  },
  sleephours: {
    label: "Sleep Hours",
    abbrev: "SH",
    measure: "h",
    type: METRIC_TYPES.HOURS,
    description: "",
    dbKey: "SLEEP_HOURS"
  },
  bloodpressure: {
    label: "Blood Pressure",
    abbrev: "BP",
    measure: "mmHg",
    type: METRIC_TYPES.PRESSURE,
    description: "",
    parts: bloodPressureParts,
    dbKey: "BLOOD_PRESSURE"
  },
  menstrualday: {
    label: "Menstrual Day",
    abbrev: "MD",
    measure: "",
    type: METRIC_TYPES.BOOL,
    description: "",
    dbKey: "MENSTRUAL_DAY"
  },
  heartrate: {
    label: "Heart Rate",
    abbrev: "HR",
    measure: "bpm", // beats per minute
    type: METRIC_TYPES.HEART_RATE,
    description: "",
    dbKey: "HEART_RATE"
  },
  heartratevar: {
    label: "Average HRV",
    fullLabel: "Average Heart Rate Variability",
    abbrev: "HRV",
    measure: "ms",
    type: METRIC_TYPES.M_SECONDS,
    description: "",
    dbKey: "HEART_RATE_VAR"
  },
  bodytemp: {
    label: "Temperature",
    abbrev: "BT",
    measure: "°C",
    type: METRIC_TYPES.TEMPERATURE,
    description: "",
    dbKey: "BODY_TEMP"
  },

  unknown: {
    abbrev: "",
    measure: "",
    type: METRIC_TYPES.UNKNOWN,
    description: "",
    dbKey: ""
  }
}
