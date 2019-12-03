import { compose, setDisplayName, withHandlers, withProps } from "recompose"
import { withNavigation } from "react-navigation"

import { FOOD_ITEM_CONTEXT_DEFAULT } from "constants"
import { FoodList } from "components/FoodList"
import { routes } from "navigation/routes"

const enhance = compose(
  setDisplayName("MealItemList"),
  withProps(props => ({ items: props.value ? props.value : [] })),
  withHandlers({
    onDelete: ({ onChange, items }) => item =>
      onChange(items.filter(i => i.id !== item.id))
  }),
  withNavigation,
  withHandlers({
    onItemPress: ({ navigation }) => (item, index) => {
      const params = { item, index, context: FOOD_ITEM_CONTEXT_DEFAULT }
      navigation.navigate(routes.FoodItem, params)
    }
  })
)

export default enhance(FoodList)
