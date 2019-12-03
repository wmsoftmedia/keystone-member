import { View } from "glamorous-native"
import { actions } from "react-redux-form/native"
import { branch, compose, withProps } from "recompose"
import { connect } from "react-redux"
import { withNavigation } from "react-navigation"
import React from "react"
import * as Sentry from "sentry-expo"

import {
  createMemberMyFood,
  getMemberMyFoodById,
  updateMemberMyFoodById
} from "./graphql"
import { getOr, pick, mapValues } from "../../../../../lib/keystone"
import { logErrorWithMemberId } from "../../../../hoc/withErrorHandler"
import { withLoader, withMemberId } from "../../../../hoc"
import EntryForm, { FORM_NAME } from "./EntryForm"
import colors from "../../../../colors"
import withRRFLoader from "../../../../hoc/withRRFLoader"

const Container = props => {
  const { saveMyFood } = props
  return (
    <View flex={1} backgroundColor={colors.white}>
      <EntryForm onSubmit={saveMyFood} />
    </View>
  )
}

const withData = compose(
  getMemberMyFoodById,
  withLoader({
    color: colors.blue5,
    backgroundColor: colors.white,
    message: "Loading..."
  })
)

const handleCreateFoodError = e => {
  console.error(e)
  logErrorWithMemberId(memberId => {
    Sentry.captureException(
      new Error(`MId:{${memberId}}, Scope:{saveMemberMyFood}, ${e}`)
    )
  })
}

const withRRFInit = compose(
  connect(
    null,
    (dispatch, { myFood }) => ({
      loadData: () => {
        const data = pick(["title", "protein", "fat", "carbs", "calories"], myFood)
        const formData = mapValues(v => (v ? String(v) : ""), data)
        dispatch(actions.load(FORM_NAME, formData))
      }
    })
  ),
  withRRFLoader
)

const withMutations = compose(
  createMemberMyFood,
  updateMemberMyFoodById
)

const enhanced = compose(
  withMemberId,
  branch(({ myFoodId }) => !!myFoodId, withData),
  withMutations,
  withProps(props => {
    const { createMyFood, updateMyFoodById, myFoodId } = props
    return {
      saveMyFood: myFoodId ? updateMyFoodById(myFoodId) : createMyFood
    }
  }),
  withNavigation,
  withProps(props => {
    const { navigation, saveMyFood } = props
    const myFood = getOr({}, "data.memberMyFoodById", props)
    return {
      myFood,
      saveMyFood: formData => {
        return saveMyFood(formData)
          .then(() => navigation.goBack())
          .catch(handleCreateFoodError)
      }
    }
  }),
  withRRFInit
)

export default enhanced(Container)
