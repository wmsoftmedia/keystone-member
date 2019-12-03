import gql from "graphql-tag";
import { graphql } from "@apollo/react-hoc";
import { withProps, compose } from "recompose";
import { isPlainObject, getOr } from "lodash/fp";
import { DocumentNode } from "graphql";

import { transformFavFood } from "keystone/food_new";
import foodFragments from "graphql/fragment/food/food";
import { IFavouriteFoodsConnection, IFavouriteFood } from "graphql/types";

export const ALL_FAVOURITES: DocumentNode = gql`
  query AllFavourites {
    favourites: allFavouriteFoods {
      nodes {
        id
        favId: id
        foodByFoodId {
          ...FoodFull
        }
      }
    }
  }
  ${foodFragments.fullFood}
`;

export interface IResponse {
  AllFavourites: {
    favourites: IFavouriteFoodsConnection;
  };
}

export const withAllFavourites = graphql<IResponse, {}>(ALL_FAVOURITES, {
  name: "AllFavourites",
  options: {
    fetchPolicy: "network-only",
    variables: { __offline__: true },
  },
});

export const withAllFavouritesTransformed = compose(
  withAllFavourites,
  withProps((props) => ({
    allFavourites: getOr([], "AllFavourites.favourites.nodes", props)
      .filter((rec: IFavouriteFood) => isPlainObject(rec) && isPlainObject(rec.foodByFoodId))
      // @ts-ignore checked by filter above
      .map((rec: IFavouriteFood) => transformFavFood(rec)),
  })),
);
