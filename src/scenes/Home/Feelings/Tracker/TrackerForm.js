import { Form } from "react-redux-form/native"
import { View } from "glamorous-native"
import React from "react"

import { FEELINGS_TRACKER_FORM } from "constants"
import LifestyleFields from "scenes/Home/Feelings/Tracker/LifestyleFields"

export const FORM_NAME = FEELINGS_TRACKER_FORM

export default props => (
  <View flex={1}>
    <Form model={FEELINGS_TRACKER_FORM} onSubmit={props.onSubmit} style={{ flex: 1 }}>
      <LifestyleFields />
    </Form>
  </View>
)
