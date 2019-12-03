import { Form, Control } from "react-redux-form/native"
import React from "react"
import styled, { TouchableOpacity, View } from "glamorous-native"

import {
  RaindropEmptyIcon,
  Raindrop1Icon,
  Raindrop2Icon,
  Raindrop3Icon,
  Raindrop4Icon,
  RaindropFullIcon,
  ChevronLeftIcon
} from "kui/icons"
import { Row } from "kui/components"
import IncrementalInput from "./IncrementalInput"
import Text from "kui/components/Text"
import colors from "kui/colors"

import { WATER_TRACKER_FORM } from "./constants"

const Container = styled.view({
  flex: 1
})

const WaterIconContainer = styled.view({
  flex: 1,
  alignItems: "center",
  justifyContent: "center"
})

const WaterTracker = props => {
  const { saveTracker, toggleWaterTracker, expanded, waterValue } = props
  return (
    <Container>
      <Row flex={1} centerY spread>
        {expanded && (
          <Form style={{ width: 156 }} model={WATER_TRACKER_FORM} onSubmit={saveTracker}>
            <Control
              model={`.water`}
              component={p => <IncrementalInput {...p} buttonProps={{ flex: 1 }} />}
              label="Water"
              labelProps={{ backgroundColor: colors.blue40, fontSize: 200 }}
              onUp={v => Math.min(99, (parseInt(v) || 0) + 1)}
              onDown={v => Math.max(0, (parseInt(v) || 0) - 1)}
              disabled={true}
              iconConfig={{ size: 24, color: colors.white }}
              renderProps={({ value }) => <Raindrop value={value} />}
            />
          </Form>
        )}

        <TouchableOpacity
          onPress={() => toggleWaterTracker(!expanded)}
          height={80}
          paddingRight={16}
          alignItems="center"
          justifyContent="center"
        >
          <View
            flex={1}
            paddingLeft={expanded ? 0 : 10}
            alignItems="center"
            justifyContent="center"
          >
            {expanded ? (
              <ChevronLeftIcon size={20} color={colors.white} />
            ) : (
              <Raindrop value={waterValue} />
            )}
          </View>
        </TouchableOpacity>
      </Row>
    </Container>
  )
}

const Raindrop = ({ value, ...rest }) => {
  return (
    <WaterIconContainer {...rest}>
      {+value === 0 ? (
        <RaindropEmptyIcon />
      ) : +value === 1 ? (
        <Raindrop1Icon />
      ) : +value === 2 ? (
        <Raindrop2Icon />
      ) : +value === 3 ? (
        <Raindrop3Icon />
      ) : +value === 4 ? (
        <Raindrop4Icon />
      ) : (
        <RaindropFullIcon />
      )}
      {value > 0 && (
        <Text variant="body2" paddingTop={8} fontSize={14} position="absolute">
          {value}
        </Text>
      )}
    </WaterIconContainer>
  )
}

export default WaterTracker
