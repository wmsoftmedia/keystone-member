import { Form } from "react-redux-form/native"
import { View } from "glamorous-native"
import { connect } from "react-redux"
import React from "react"

import { NUTRITION_TRACKER_FORM } from "constants"
import Meals from "scenes/Home/Nutrition/Tracker/Meals"

class TrackerForm extends React.Component {
  render() {
    const {
      meals,
      date,
      onSubmit,
      favourites,
      addFavourite,
      totals,
      profile
    } = this.props
    return (
      <View flex={1}>
        <Form model={NUTRITION_TRACKER_FORM} onSubmit={onSubmit} style={{ flex: 1 }}>
          <Meals
            date={date}
            meals={meals}
            favourites={favourites}
            addFavourite={addFavourite}
            totals={totals}
            profile={profile}
          />
        </Form>
      </View>
    )
  }
}

const mapStateToProps = state => {
  const { meals } = state.formsRoot.nutritionTracker
  return { meals }
}

export default connect(mapStateToProps)(TrackerForm)
