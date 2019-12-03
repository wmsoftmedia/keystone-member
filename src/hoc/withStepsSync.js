import { Pedometer } from "expo-sensors"
import moment from "moment"
import { compose, withHandlers, lifecycle } from "recompose"
import _ from "lodash/fp"

import withUpdateSteps from "graphql/mutation/steps/updateSteps"

const defaultConfig = {
  num_days: 7,
  updateOn: "update" // update/mount
}

export default config => {
  const conf = { ...defaultConfig, ...config }
  return compose(
    withUpdateSteps,
    withHandlers({
      handleUpdateSteps: props => () => {
        const getSteps = async () => {
          const days = _.times(i => moment().add(-i, "days"), conf.num_days)
          const steps = []
          for (const date of days) {
            const start = moment(date)
              .startOf("date")
              .toDate()
            const end = moment(date)
              .endOf("date")
              .toDate()
            try {
              const result = await Pedometer.getStepCountAsync(start, end)
              result.steps && steps.push({ stepsCount: result.steps, date })
            } catch (e) {}
          }
          return steps
        }

        Pedometer.isAvailableAsync().then(
          available => available && getSteps().then(steps => props.updateSteps(steps))
        )
      }
    }),
    lifecycle({
      componentDidMount() {
        conf.updateOn === "mount" && this.props.handleUpdateSteps()
      },
      componentDidUpdate() {
        conf.updateOn === "update" && this.props.handleUpdateSteps()
      }
    })
  )
}
