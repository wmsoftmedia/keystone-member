import React from "react"

import Stats from "./Stats"

const StatsSwiper = props => {
  const { stats } = props

  return [
    stats.map(({ label, data }, i) => (
      <Stats key={i} label={label} stats={data} />
    ))
  ]
}

export default StatsSwiper
