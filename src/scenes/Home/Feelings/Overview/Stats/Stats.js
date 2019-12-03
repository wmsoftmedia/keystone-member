import { LayoutAnimation } from "react-native"
import { lifecycle } from "recompose"
import React, { Component } from "react"

import { CircleGauge } from "kui/components/Gauge"
import Row from "components/Row"

import { metricDisplay } from "../../display"

class Stats extends Component {
  render() {
    const { stats: statsRaw } = this.props
    const stats = statsRaw.map(metricDisplay)
    return (
      <Row
        flex={1}
        alignItems="flex-start"
        justifyContent="space-evenly"
        paddingTop={4}
      >
        {stats.map((s, i) => (
          <CircleGauge
            key={String(i)}
            value={s.value}
            max={10}
            labelBelow={s.label}
            showValueWithin
          />
        ))}
      </Row>
    )
  }
}

export default lifecycle({
  componentWillMount() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }
})(Stats)
