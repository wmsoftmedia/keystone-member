import { cals, macroCals, mealTotals } from "./index"

/** NUTRITION */
// cals
describe("cals", function() {
  it("returns 0 for an empty object", () => {
    expect(cals({})).toBe(0)
  })

  it("has a correct coefficient for protein", () => {
    const meal = { protein: 1 }
    expect(cals(meal)).toBe(4)
  })

  it("has a correct coefficient for fat", () => {
    const meal = { fat: 1 }
    expect(cals(meal)).toBe(9)
  })

  it("has a correct coefficient for carbs", () => {
    const meal = { carbs: 1 }
    expect(cals(meal)).toBe(4)
  })

  it("returns a sum depending on protein, fat, and carbs", () => {
    const meal = {
      protein: 1, 
      fat: 1,
      carbs: 1
    }
    expect(cals(meal)).toBe(17)
  })

  it("accepts string properties", () => {
    const meal = {
      protein: "1", 
      fat: "1",
      carbs: "1"
    }
    expect(cals(meal)).toBe(17)
  })

  it("returns 0 if properties are empty string, null or undefined", () => {
    const meal = {
      protein: "", 
      fat: null,
      carbs: undefined
    }
    expect(cals(meal)).toBe(0)
  })
})


// macroCals
describe("macroCals", function() {
  it("has a correct coefficient for fat", () => {
    const macro = "fat"
    const value = 1
    expect(macroCals(macro, value)).toBe(9)
  })

  it("has a correct coefficient for non fat", () => {
    const macro = "carbs"
    const value = 1
    expect(macroCals(macro, value)).toBe(4)
  })

  it("accepts a string with number as a value", () => {
    const macro = "carbs"
    const value = "1"
    expect(macroCals(macro, value)).toBe(4)
  })
})


// mealTotals
describe("mealTotals", function() {
  const emptyTotals = {
    cals: 0,
    protein: 0,
    fat: 0,
    carbs: 0
  }

  const total = {
    cals: 3,
    protein: 3,
    fat: 3,
    carbs: 3
  }

  it("returns 0's if there is no meals at all", () => {
    expect(mealTotals()).toEqual(emptyTotals)
  })

  it("returns 0's if meals param is empty", () => {
    expect(mealTotals([])).toEqual(emptyTotals)
  })

  it("returns 0's if there are no entries in meals", () => {
    expect(mealTotals([{}])).toEqual(emptyTotals)
  })

  it("returns 0's if there are no cals and macros values in meals", () => {
    const meals = [{ entries: { macros: {} } }]
    expect(mealTotals(meals)).toEqual(emptyTotals)
  })

  it("returns correct values for a single meal", () => {
    const meals = [{
      entries: {
        cals: 3,
        macros: {
          protein: 3,
          fat: 3,
          carbs: 3
        }
      }
    }]
    expect(mealTotals(meals)).toEqual(total)
  })

  it("returns correct values for 2 meals", () => {
    const meals = [{
        entries: {
          cals: 1,
          macros: {
            protein: 1,
            fat: 1,
            carbs: 1
          }
        }
      }, {
        entries: {
          cals: 2,
          macros: {
            protein: 2,
            fat: 2,
            carbs: 2
          }
        }
      }
    ]
    expect(mealTotals(meals)).toEqual(total)
  })

  it("accepts strings as values", () => {
    const meals = [{
      entries: {
        cals: "3",
        macros: {
          protein: "3",
          fat: "3",
          carbs: "3"
        }
      }
    }]
    expect(mealTotals(meals)).toEqual(total)
  })

  it("handles nulls, empty strings, undefined's, and void 0's correctly", () => {
    const meals = [{
        entries: {
          cals: null,
          macros: {
            protein: "",
            fat: undefined,
            carbs: void 0
          }
        }
      }, {
        entries: {
          cals: 3,
          macros: {
            protein: 3,
            fat: 3,
            carbs: 3
          }
        }
      }
    ]
    expect(mealTotals(meals)).toEqual(total)
  })

  it("handles empty entries correctly", () => {
    const meals = [{ entries: {} }, {
        entries: {
          cals: 3,
          macros: {
            protein: 3,
            fat: 3,
            carbs: 3
          }
        }
      }
    ]
    expect(mealTotals(meals)).toEqual(total)
  })
})
