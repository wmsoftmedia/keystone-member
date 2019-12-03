import React from "react"
import { compose, withHandlers } from "recompose"
import { withNavigation } from "react-navigation"
import { withMappedNavigationParams } from "react-navigation-props-mapper"
import _ from "lodash/fp"

import { ModalScreen } from "components/Background"
import SpecsFormView from "./SpecsForm"

export const SpecsForm = SpecsFormView

const SpecsFormModal = props => {
  const { set, onSaveForm } = props
  return (
    <ModalScreen>
      <SpecsForm set={set} onSave={onSaveForm} />
    </ModalScreen>
  )
}

const enhanced = compose(
  withMappedNavigationParams(),
  withNavigation,
  withHandlers({
    onSaveForm: ({ navigation, onSave }) => form => {
      onSave && onSave(form)
      navigation.goBack()
    }
  })
)

export default enhanced(SpecsFormModal)
