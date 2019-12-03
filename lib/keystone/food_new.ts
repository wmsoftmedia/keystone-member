import {
  IKsFoodbankFoodItem,
  IKeystoneFoodItem,
  IFood as IKsFood,
  Maybe,
  IFavouriteFood,
} from "graphql/types";
import { SOURCE_KS_SEARCH, SOURCE_KS_FOODBANK, SOURCE_DB_FOOD, IFood } from "keystone/food";
import { round } from "keystone";

export const roundMult = (num: number): number => Math.round(num * 100) / 100;

export const roundFact = (num: Maybe<Voidable<number>>): number | undefined =>
  num === null || num === void 0 ? void 0 : round(num);

function unwrap<T>(thing: Maybe<Voidable<T>>): Voidable<T> {
  return thing || void 0;
}

export const transformKsFoodbank = (food: IKsFoodbankFoodItem): IFood => {
  const servings = food.servings.nodes;

  return {
    id: food.id,
    name: food.name,
    brand: food.brand || void 0,
    macros: {
      calories: roundFact(food.nutritionFacts.calories) || 0,
      protein: roundFact(food.nutritionFacts.protein) || 0,
      fat: roundFact(food.nutritionFacts.fat) || 0,
      carbs: roundFact(food.nutritionFacts.carbs) || 0,
      fibre: roundFact(food.nutritionFacts.fibre) || 0,
      alcohol: roundFact(food.nutritionFacts.alcohol),
      saturatedFat: roundFact(food.nutritionFacts.saturatedFat),
      polyunsaturatedFat: roundFact(food.nutritionFacts.polyunsaturatedFat),
      monounsaturatedFat: roundFact(food.nutritionFacts.monounsaturatedFat),
      transFat: roundFact(food.nutritionFacts.transFat),
      cholesterol: roundFact(food.nutritionFacts.cholesterol),
      sodium: roundFact(food.nutritionFacts.sodium),
      potassium: roundFact(food.nutritionFacts.potassium),
      sugar: roundFact(food.nutritionFacts.sugar),
      vitaminA: roundFact(food.nutritionFacts.vitaminA),
      vitaminC: roundFact(food.nutritionFacts.vitaminC),
      calcium: roundFact(food.nutritionFacts.calcium),
      iron: roundFact(food.nutritionFacts.iron),
    },
    servings: servings.map((s) => ({
      ...s,
      volume: unwrap(s.volume),
      multiplier: roundMult(s.multiplier),
    })),
    defaultServingIndex: servings.findIndex((s) => s.isDefaultServing),
    externalId: unwrap(food.externalId),
    provider: unwrap(food.provider),
    origin: unwrap(food.origin),
    type: SOURCE_KS_FOODBANK,
    isMyFood: false,
    isGeneric: typeof food.brand === "string",
    meta: {},
  };
};

export const transformKsSearch = (food: IKeystoneFoodItem): IFood => {
  const serving = {
    num: 1,
    name: food.servingName,
    volume: food.servingVolume ? +food.servingVolume : void 0,
    unit: food.servingUnit,
    isDefaultServing: true,
    multiplier: +food.servingMult,
  };

  return {
    id: food.id,
    name: food.name,
    brand: food.brand || void 0,
    macros: {
      calories: round(+(food.refCals || "0")),
      protein: round(+(food.refProtein || "0")),
      fat: round(+(food.refFat || "0")),
      carbs: round(+(food.refCarbs || "0")),
      fibre: 0,
    },
    servings: [serving],
    defaultServingIndex: 0,
    externalId: void 0,
    provider: "KS",
    type: SOURCE_KS_SEARCH,
    origin: food.origin || void 0,
    isMyFood: false,
    isGeneric: typeof food.brand === "string",
    meta: {
      hasStar: food.hasStar === true,
    },
  };
};

export const transformKsFood = (food: IKsFood): IFood => {
  return {
    id: food.id,
    name: food.title,
    brand: unwrap(food.brand),
    macros: {
      calories: roundFact(food.calories) || 0,
      protein: roundFact(food.protein) || 0,
      fat: roundFact(food.fat) || 0,
      carbs: roundFact(food.carbs) || 0,
      fibre: roundFact(food.fibre) || 0,
      alcohol: roundFact(food.alcohol),
      saturatedFat: roundFact(food.saturatedFat),
      polyunsaturatedFat: roundFact(food.polyunsaturatedFat),
      monounsaturatedFat: roundFact(food.monounsaturatedFat),
      transFat: roundFact(food.transFat),
      cholesterol: roundFact(food.cholesterol),
      sodium: roundFact(food.sodium),
      potassium: roundFact(food.potassium),
      sugar: roundFact(food.sugar),
      vitaminA: roundFact(food.vitaminA),
      vitaminC: roundFact(food.vitaminC),
      calcium: roundFact(food.calcium),
      iron: roundFact(food.iron),
    },
    servings: (food.servings || []).map((s, i) => {
      const volume = (s && +s.volume) || 100;
      return {
        num: (s && +s.num) || 1,
        name: (s && s.name) || " ",
        volume,
        unit: (s && s.unit) || "g",
        isDefaultServing: i === food.defaultServingIndex,
        multiplier: volume / 100,
      };
    }),
    defaultServingIndex: food.defaultServingIndex,
    externalId: unwrap(food.externalId),
    provider: unwrap(food.provider),
    type: SOURCE_DB_FOOD,
    origin: unwrap(food.origin),
    isMyFood: typeof food.memberId === "number",
    isGeneric: typeof unwrap(food.brand) === "undefined",
    meta: {},
  };
};

export const transformFavFood = (food: IFavouriteFood): IFood => {
  return {
    // @ts-ignore
    ...transformKsFood(food.foodByFoodId),
    meta: {
      favId: food.id,
    },
  };
};
