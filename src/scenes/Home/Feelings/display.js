export const LIFESTYLE_KEYS = ["gratitude", "motivation", "stress_optimization", "sleep"]

export const metricDisplay = ({ key: rawKey, ...rest }) => {
  const key = rawKey.toLowerCase()
  switch (key) {
    case "sleep":
      return {
        key,
        label: "Sleep",
        abbrev: "SLE",
        measure: "/10",
        description: "",
        ...rest
      }
    case "stress_optimization":
      return {
        key,
        label: "Stress Opt.",
        abbrev: "S.O.",
        measure: "/10",
        description: "",
        ...rest
      }
    case "motivation":
      return {
        key,
        label: "Motivation",
        abbrev: "MOT",
        measure: "/10",
        description: "",
        ...rest
      }
    case "gratitude":
      return {
        key,
        label: "Gratitude",
        abbrev: "GRA",
        measure: "/10",
        description: "",
        ...rest
      }
    default:
      return {
        key,
        label: key,
        measure: "",
        ...rest
      }
  }
}
