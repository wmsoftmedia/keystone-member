export type Micro = Number;
export type Macro = Number;
export type Calories = Number;

export const SOURCE_UNKNOWN = 0;
// export const SOURCE_FS_SEARCH = 1
export const SOURCE_FS_FULL = 2;
export const SOURCE_DB_FOOD = 3;
export const SOURCE_DB_FOOD_OLD = 4;
export const SOURCE_DB_CACHE = 5;
export const SOURCE_CACHE_FS = 6;
export const SOURCE_CACHE_MACRO = 7;
export const SOURCE_CACHE_OLD_MY_FOOD = 8;
export const SOURCE_CACHE_DB_FOOD = 9;
export const SOURCE_OLD_FAVS = 10;
export const SOURCE_RB = 11;
export const SOURCE_FAVS = 12;
export const SOURCE_KS_SEARCH = 13;
export const SOURCE_KS_FOODBANK = 14;

export type FoodSource = Number;

export interface INutritionFacts {
  calories: Calories;
  fat: Macro;
  carbs: Macro;
  protein: Macro;
  fibre: Macro;
  alcohol?: Macro;
  saturatedFat?: Micro;
  polyunsaturatedFat?: Micro;
  monounsaturatedFat?: Micro;
  transFat?: Micro;
  cholesterol?: Micro;
  sodium?: Micro;
  potassium?: Micro;
  sugar?: Micro;
  vitaminA?: Micro;
  vitaminC?: Micro;
  calcium?: Micro;
  iron?: Micro;
}

export interface IServing {
  num: number;
  name: string;
  volume?: number;
  unit: string;
  isDefaultServing: boolean;
  multiplier: number;
}

export interface IFood {
  id: String;
  name: String;
  brand?: String;
  macros: INutritionFacts;
  servings: IServing[];
  defaultServingIndex: number;
  externalId?: string;
  provider?: string;
  type: FoodSource;
  origin?: string;
  isMyFood: boolean;
  isGeneric: boolean;
  meta: object;
}
