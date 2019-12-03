import { View } from "glamorous-native"
import { compose, withProps } from "recompose"
import React from "react"
import moment from "moment"

import { InfoIcon, LinkIcon } from "kui/icons"
import { Row } from "kui/components"
import { SetTypes } from "scenes/Home/TrainingV3/common"
import { withModelQueries } from "scenes/Home/TrainingV3/components/WorkoutControls"
import Card from "kui/components/Card"
import InfoMessage from "components/InfoMessage"
import Line from "kui/components/Line"
import Text from "kui/components/Text"
import _ from "lodash/fp"
import colors from "kui/colors"

const getValueText = (spec = {}, converter) => {
  if (!spec) return "--"

  const conv = spec.unit === "kg" ? converter.weightConverter : v => v

  switch (spec.type.toLowerCase()) {
    case "value":
      return `${conv(spec.value)}` || "--"
    case "range":
      if (!spec.start && !spec.end) {
        return "∞"
      }
      if (!spec.end) {
        return `${conv(spec.start || 0)}+`
      }
      if (!spec.start) {
        return `max ${conv(spec.end || 0)}`
      }
      return `${conv(spec.start || 0)}-${conv(spec.end || 0)}`
    default:
      return "--"
  }
}

const getUnitText = unit => {
  if (unit instanceof Object) {
    return "% " + unit.RMP + "RM"
  }

  switch (unit.toLowerCase()) {
    case "bwp":
      return "% BW"
    case "bw":
      return "BW"
    default:
      return " " + unit
  }
}

const getTargetText = (spec, converter) => {
  if (!spec) return "--"

  const unit = getUnitText(spec.unit === "kg" ? converter.weightUnit : spec.unit)

  switch (spec.type.toLowerCase()) {
    case "value":
    case "range":
      return getValueText(spec, converter) + unit

    case "sequence":
      return spec.sequence.map(s => getValueText(s, converter)).join(" / ") + unit

    case "progression":
      return getValueText(spec.start, converter) + "/... " + unit

    default:
      return "--" + unit
  }
}

const getEffortText = (spec, converter) => {
  if (!spec) {
    return "--"
  }

  return getTargetText(spec, converter)
}

const getLoadText = (spec, converter) => {
  if (!spec) {
    return "--"
  }

  if (!(spec.unit instanceof Object) && spec.unit.toLowerCase() === "bw") {
    return "BW"
  }

  return getTargetText(spec, converter)
}

const Rest = ({ timeout, variant = "round1" }) => {
  const formatedTimeout =
    timeout < 60
      ? moment.utc(timeout * 1000).format("s [sec]")
      : timeout < 3600
      ? moment.utc(timeout * 1000).format("m:ss")
      : moment.utc(timeout * 1000).format("HH:mm:ss")
  if (variant === "global") {
    return (
      <Card color={colors.green60} padding={12} marginTop={16} alignItems="center">
        <Text variant="body2">Rest {formatedTimeout}</Text>
      </Card>
    )
  } else if (variant === "lastRound") {
    return (
      <Row
        alignItems="center"
        justifyContent="center"
        paddingVertical={12}
        paddingHorizontal={16}
        backgroundColor={colors.darkBlue80}
        marginHorizontal={-16}
        borderBottomLeftRadius={12}
        borderBottomRightRadius={12}
      >
        <Text variant="caption2" color={colors.darkBlue30}>
          REST {formatedTimeout}
        </Text>
      </Row>
    )
  } else {
    return (
      <Row
        alignItems="center"
        justifyContent="center"
        paddingVertical={12}
        paddingHorizontal={16}
        backgroundColor={colors.darkBlue80}
        marginHorizontal={-16}
      >
        <Text variant="caption2" color={colors.darkBlue30}>
          REST {formatedTimeout}
        </Text>
      </Row>
    )
  }
}

const Exercises = ({ exercises, converter }) =>
  exercises.length > 0 && (
    <View>
      {exercises.map((e, i) => {
        const effort =
          _.getOr(null, "targets.Calories", e) ||
          _.getOr(null, "targets.Repetitions", e) ||
          _.getOr(null, "targets.Distance", e) ||
          _.getOr(null, "targets.Duration", e)

        const isCluster = !!_.getOr(null, "targets.Cluster", e)

        const load = _.getOr(null, "targets.Load", e)
        const timeout = _.getOr(0, "timeout.value", e)
        const exerciseName = e.name
          ? e.name.charAt(0).toUpperCase() + e.name.slice(1)
          : ""
        return (
          <View key={i}>
            <Row alignItems="center" paddingVertical={12}>
              <View flex={1}>
                <Text variant="caption1">{_.trim(exerciseName)}</Text>
              </View>
              <View flex={1} alignItems="center">
                <Text variant="caption1">{getEffortText(effort, converter)}</Text>
              </View>
              <View flex={1} alignItems="flex-end">
                <Text variant="caption1">{getLoadText(load, converter)}</Text>
              </View>
            </Row>
            {i !== exercises.length - 1 && !timeout && (
              <React.Fragment>
                <Line marginHorizontal={0} color={colors.darkBlue80}>
                  {isCluster && (
                    <View
                      position="absolute"
                      left={4}
                      top={-6}
                      transform={[{ rotateZ: "-45deg" }]}
                    >
                      <LinkIcon size={14} color={colors.darkBlue30} />
                    </View>
                  )}
                </Line>
              </React.Fragment>
            )}
            {timeout > 0 && <Rest timeout={timeout} />}
          </View>
        )
      })}
    </View>
  )

const Rounds = compose(withModelQueries)(props => {
  const { setId, model, converter, setTimeout } = props
  const rounds = props.rounds(setId, false)

  return rounds.length > 0 ? (
    <View>
      {rounds.length > 1 && (
        <Row alignItems="center" justifyContent="center" marginBottom={12}>
          <InfoIcon color={colors.darkBlue30} />
          <Text variant="caption1" paddingLeft={8}>
            Alternate round by round
          </Text>
        </Row>
      )}

      {rounds.map((round, index) => {
        const timeout = _.getOr(0, "timeout.value", round)

        const exercises = props.exercises(round.id) || []
        return (
          <View key={index}>
            {index === 0 && exercises.length > 0 && (
              <Row
                alignItems="center"
                paddingVertical={12}
                paddingHorizontal={16}
                backgroundColor={colors.darkBlue80}
                marginHorizontal={-16}
              >
                <View flex={1}>
                  <Text variant="caption2">EXERCISE</Text>
                </View>
                <View flex={1} alignItems="center">
                  <Text variant="caption2">EFFORT</Text>
                </View>
                <View flex={1} alignItems="flex-end">
                  <Text variant="caption2">LOAD</Text>
                </View>
              </Row>
            )}
            {exercises.length === 0 && (
              <InfoMessage title="Empty set" subtitle="This set has no exercises" />
            )}
            <Exercises model={model} exercises={exercises} converter={converter} />
            {index !== rounds.length - 1 && !timeout && (
              <Line marginHorizontal={0} color={colors.darkBlue80} />
            )}
            {timeout > 0 && (
              <Rest
                timeout={timeout}
                variant={index === rounds.length - 1 ? "lastRound" : "round"}
              />
            )}
          </View>
        )
      })}
    </View>
  ) : (
    <InfoMessage title="Empty set" subtitle="This set has no exercises" />
  )
})

const SetItem = compose(withModelQueries)(props => {
  const { model, set, converter } = props
  const setType = _.getOr("", "type.setType", set)
  const specs = []
  const numRounds = _.getOr(null, "targets.Rounds.value", set)
  if (numRounds && numRounds > 0) {
    specs.push("x" + numRounds)
  }
  const timeLimit = _.getOr(null, "constraints.TimeLimit.value", set)
  if (timeLimit && timeLimit > 0) {
    specs.push("" + Math.floor(timeLimit / 60) + " Min")
  }

  const setTimeout = _.getOr(0, "timeout.value", set)
  const typeInfo = SetTypes.properties[SetTypes[setType.toUpperCase()] || 0]

  let typeSufix = ""
  if (setType === "EMOM") {
    const timeLimit = _.getOr(60, "[0].constraints.TimeLimit.value", props.rounds(set.id))
    if (timeLimit > 60) {
      typeSufix = Math.ceil(timeLimit / 60)
    }
  }

  return (
    <View>
      <Card
        color={colors.darkBlue90}
        padding={16}
        marginTop={16}
        paddingBottom={0}
        elevated="false"
      >
        <Row alignItems="center" justifyContent="space-between">
          <Row alignItems="center">
            <typeInfo.icon />
            <View paddingLeft={8}>
              <Text variant="body2">{typeInfo.label}</Text>
              <Text variant="caption2">{typeInfo.name + typeSufix}</Text>
            </View>
          </Row>
          <Text variant="body2">{specs.join(" | ")}</Text>
        </Row>
        {!!set.notes && (
          <Row marginTop={12}>
            <Text variant="caption1">{set.notes}</Text>
          </Row>
        )}
        <View marginTop={12}>
          <Rounds model={model} setId={set.id} converter={converter} />
        </View>
      </Card>
      {setTimeout > 0 && <Rest timeout={setTimeout} variant="global" />}
    </View>
  )
})

const StageItem = withModelQueries(props => {
  const { item, model, converter } = props
  const sets = props.sets(item.id)
  return (
    <View paddingTop={24}>
      <Row alignItems="center">
        <Text variant="body2">Workout details</Text>
      </Row>
      {sets.map((set, i) => (
        <SetItem model={model} key={i} set={set} converter={converter} />
      ))}
    </View>
  )
})

const StagesList = ({ stages, model, converter, ...rest }) => {
  const _stages = stages()
  return (
    <View flex={1} {...rest}>
      {_stages.map((item, index) => (
        <StageItem
          key={index}
          model={model}
          index={index}
          item={item}
          converter={converter}
        />
      ))}
    </View>
  )
}

export default withModelQueries(StagesList)
