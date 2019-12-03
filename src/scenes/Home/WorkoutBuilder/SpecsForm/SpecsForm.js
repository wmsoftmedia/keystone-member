import React from "react"
import { View, ScrollView } from "glamorous-native"
import { compose, withHandlers, withState, defaultProps } from "recompose"
import _ from "lodash/fp"

import Checkbox from "kui/components/Checkbox"
import { PrimaryButton } from "kui/components/Button"
import Line from "kui/components/Line"
import Text from "kui/components/Text"
import { DEFAULT_SET_TYPE } from "scenes/Home/WorkoutBuilder/common"
import { setTypes, defaultSpecs, setSpecs } from "scenes/Home/WorkoutBuilder/common"
import colors, { gradients } from "kui/colors"
import SpecView from "./SpecView"

const SpecsForm = props => {
  const { form, variant, setForm, onSaveForm, saveButtonTitle } = props
  const curSetType = setTypes.find(st => st.value === form.type)
  return (
    <View flex={1}>
      <ScrollView flex={1}>
        <View flex={1} padding={20}>
          <View>
            <Text variant="body2">Set Type</Text>
            {setTypes.map((setType, i) => (
              <View key={i} marginTop={24}>
                <Checkbox
                  label={setType.name}
                  description={setType.description}
                  checked={setType.value === form.type}
                  onChange={() => setForm({ ...form, type: setType.value })}
                />
              </View>
            ))}
          </View>
          {!!curSetType && (
            <View marginTop={24}>
              {(curSetType.specs || []).map((spec, i) => {
                return (
                  !!setSpecs[spec] &&
                  setSpecs[spec].editable && (
                    <View key={i}>
                      <Line marginHorizontal={0} />
                      <SpecView
                        spec={spec}
                        value={_.getOr(null, `specs.${spec}.value`, form)}
                        onChange={v =>
                          setForm({
                            ...form,
                            specs: {
                              ...form.specs,
                              [spec]: {
                                ...(form.specs ? form.specs[spec] : {}),
                                value: v
                              }
                            }
                          })
                        }
                      />
                    </View>
                  )
                )
              })}
            </View>
          )}
        </View>
      </ScrollView>
      <View
        paddingHorizontal={20}
        paddingBottom={20}
        paddingTop={10}
        backgroundColor={variant === "modal" ? colors.darkBlue80 : gradients.bg[1]}
        elevation={15}
        shadowOpacity={0.4}
        shadowColor={colors.black}
        shadowOffset={{ width: 0, height: 0 }}
        shadowRadius={20}
      >
        <PrimaryButton label={saveButtonTitle} onPress={onSaveForm} />
      </View>
    </View>
  )
}

const emptySet = {
  type: DEFAULT_SET_TYPE,
  specs: {}
}

const enhanced = compose(
  defaultProps({
    set: {},
    onSave: () => {},
    saveButtonTitle: "SAVE SET",
    variant: "modal"
  }),
  withState("form", "setForm", ({ set }) => ({ ...emptySet, ...set })),
  withHandlers({
    onSaveForm: ({ onSave, form }) => () => {
      const setType = setTypes.find(st => st.value === form.type)

      const specs = _.keys(form.specs || {})
        .filter(s => setType.specs.indexOf(s) !== -1)
        .reduce((acc, s) => ({ ...acc, [s]: form.specs[s] }), {})

      form.specs = { ...defaultSpecs(form.type), ...specs }

      onSave(form)
    }
  })
)

export default enhanced(SpecsForm)
