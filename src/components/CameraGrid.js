import React from "react"
import styled, { View } from "glamorous-native"

const Tick = styled(p => <View {...p} />)(
  {
    position: "absolute"
  },
  ({ color }) => ({
    backgroundColor: color
  })
)

const CameraGrid = props => {
  const { thickness: t = 2, size = "10%", ...r } = props
  return [
    <Tick key="tl1" left={t} width={size} height={t} {...r} />,
    <Tick key="tr1" right={t} width={size} height={t} {...r} />,
    <Tick key="bl1" left={t} bottom={0} width={size} height={t} {...r} />,
    <Tick key="br1" right={t} bottom={0} width={size} height={t} {...r} />,
    <Tick key="tl2" left={0} height={size} width={t} {...r} />,
    <Tick key="tr2" right={0} height={size} width={t} {...r} />,
    <Tick key="bl2" left={0} bottom={0} height={size} width={t} {...r} />,
    <Tick key="br2" right={0} bottom={0} height={size} width={t} {...r} />
  ]
}

export default CameraGrid
