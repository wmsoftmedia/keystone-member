import gql from "graphql-tag";
import moment from "moment";
import { IKsFoodbankFoodItemsConnection } from "graphql/types";

const tz = moment.tz.guess() || "Australia/Melbourne";
const region = tz.indexOf("Europe/") === 0 ? "GB" : "AU";

export const FOOD_ITEM_BY_BARCODE = gql`
  query KSFoodItemByBarcode($barcode: String!, $meta: BarcodeSearchMetaInput!) {
    foodbankFoodByBarcode(barcode: $barcode, meta: $meta) {
      totalCount
      nodes {
        id
        name
        brand
        origin
        nutritionFacts {
          calories
          protein
          fat
          carbs
          fibre
          alcohol
          saturatedFat
          polyunsaturatedFat
          monounsaturatedFat
          transFat
          cholesterol
          sodium
          potassium
          sugar
          vitaminA
          vitaminC
          calcium
          iron
          water
          ash
        }
        servings {
          totalCount
          nodes {
            num
            name
            volume
            unit
            isDefaultServing
            multiplier
          }
        }
        externalId
        provider
        type
        class
        isMyFood
        isGeneric
      }
    }
  }
`;

export interface IResponse {
  foodbankFoodByBarcode: IKsFoodbankFoodItemsConnection;
}

export const foodItemByBarcodeQuery = (barcode: string): any => ({
  query: FOOD_ITEM_BY_BARCODE,
  fetchPolicy: "network-only",
  variables: { __offline__: false, barcode, meta: { region } },
});
