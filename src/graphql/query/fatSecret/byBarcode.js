import gql from "graphql-tag"
import moment from "moment"
import { fatSecretFragments } from "graphql/fragment/food/fatSecret"

const tz = moment.tz.guess() || "Australia/Melbourne"
const region = tz.indexOf("Europe/") === 0 ? "GB" : "AU"

const FOOD_BY_BARCODE = gql`
  query FoodByBarcode($barcode: String!, $meta: BarcodeInput!) {
    currentMember {
      id
      findFoodByBarcode(barcode: $barcode, meta: $meta) {
        id
        foodItem {
          id: foodId
          type
          brand
          name
        }
        servings {
          ...FsServing
        }
      }
    }
  }
  ${fatSecretFragments.serving}
`

export const foodByBarcodeQuery = barcode => ({
  query: FOOD_BY_BARCODE,
  fetchPolicy: "network-only",
  variables: { __offline__: false, barcode, meta: { region } }
})
