import gql from "graphql-tag";
import { graphql } from "@apollo/react-hoc";
import { DocumentNode } from "graphql";
import { compose, withProps } from "recompose";
import { isPlainObject, getOr } from "lodash/fp";

import foodFragments from "graphql/fragment/food/food";
import { transformKsFood } from "keystone/food_new";
import { IMemberEvaluatedRecipe, IMemberEvaluatedRecipesConnection } from "graphql/types";

export const ALL_MY_RECIPES_QUERY: DocumentNode = gql`
  query AllMyRecipes {
    currentMember {
      id
      allMyRecipes {
        nodes {
          id
          foodByFoodId {
            ...FoodFull
          }
        }
      }
    }
  }
  ${foodFragments.fullFood}
`;

export interface IResponse {
  AllMyRecipes: {
    currentMember: {
      allMyRecipes: IMemberEvaluatedRecipesConnection;
    };
  };
}

const query = graphql<IResponse, {}>(ALL_MY_RECIPES_QUERY, { name: "AllMyRecipes" });

export const AllMyRecipesTransformed = compose(
  query,
  withProps((props) => ({
    allMyRecipes: getOr([], "AllMyRecipes.currentMember.allMyRecipes.nodes", props)
      .filter(
        (rec: IMemberEvaluatedRecipe) => isPlainObject(rec) && isPlainObject(rec.foodByFoodId),
      )
      // @ts-ignore checked by filter above
      .map((rec: IRecentFood) => transformKsFood(rec.foodByFoodId)),
  })),
);

export default query;
