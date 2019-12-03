import gql from "graphql-tag";

export default gql`
  fragment ServingFull on FoodServing {
    num
    name
    volume
    unit
  }
`;
