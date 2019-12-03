import gql from "graphql-tag";
import { graphql } from "@apollo/react-hoc";
import { compose, withProps } from "recompose";
import { getOr, isPlainObject } from "lodash/fp";

import foodFragments from "graphql/fragment/food/food";
import { transformKsFood } from "keystone/food_new";
import { IMemberMyFoodsConnection, IMemberMyFood } from "graphql/types";

export const ALL_MY_FOOD_QUERY = gql`
  query AllMyFood {
    currentMember {
      id
      allMyFood {
        nodes {
          ...FoodFull
        }
      }
    }
  }
  ${foodFragments.fullFood}
`;

export interface IResponse {
  AllMyFood: {
    currentMember: {
      allMyFood: IMemberMyFoodsConnection;
    };
  };
}

const query = graphql<IResponse, {}>(ALL_MY_FOOD_QUERY, {
  name: "AllMyFood",
  options: {
    fetchPolicy: "network-only",
    variables: { __offline__: true },
  },
});

export const AllMyFoodTransformed = compose(
  query,
  withProps((props) => ({
    allMyFoodItems: getOr([], "AllMyFood.currentMember.allMyFood.nodes", props)
      .filter((rec: IMemberMyFood) => isPlainObject(rec))
      // @ts-ignore checked by filter above
      .map((rec: IMemberMyFood) => transformKsFood(rec)),
  })),
);
