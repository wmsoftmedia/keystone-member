import gql from "graphql-tag";
import { graphql } from "@apollo/react-hoc";
import { withProps, compose } from "recompose";
import { isPlainObject, getOr } from "lodash/fp";
import { DocumentNode } from "graphql";

import { transformKsFood } from "keystone/food_new";
import foodFragments from "graphql/fragment/food/food";
import { IRecentFoodsConnection, IRecentFood } from "graphql/types";

export const ALL_RECENT_FOOD: DocumentNode = gql`
  query AllRecentFood {
    recent: allRecentFoods(orderBy: UPDATED_AT_DESC, first: 50) {
      nodes {
        id
        foodId
        foodByFoodId {
          ...FoodFull
        }
      }
    }
  }
  ${foodFragments.fullFood}
`;

export interface IResponse {
  AllRecentFood: {
    recent: IRecentFoodsConnection;
  };
}

const query = graphql<IResponse, {}>(ALL_RECENT_FOOD, {
  name: "AllRecentFood",
  options: {
    fetchPolicy: "network-only",
    variables: { __offline__: true },
  },
});

export const allRecentFoodTransformed = compose(
  query,
  withProps((props) => ({
    recentFoodItems: getOr([], "AllRecentFood.recent.nodes", props)
      .filter((rec: IRecentFood) => isPlainObject(rec) && isPlainObject(rec.foodByFoodId))
      // @ts-ignore checked by filter above
      .map((rec: IRecentFood) => transformKsFood(rec.foodByFoodId)),
  })),
);

export default query;
