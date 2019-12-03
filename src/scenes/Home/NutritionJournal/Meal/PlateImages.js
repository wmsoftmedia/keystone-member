import { ClipPath, Defs, G, Path, Image, Svg } from "react-native-svg"
import { Image as RNImage, View } from "glamorous-native"
import React from "react"
import _ from "lodash/fp"

import colors from "kui/colors"

const getSectorPath = (x, y, diameter, a1, a2, isLine = false) => {
  const degToRad = Math.PI / 180
  const halfDiameter = diameter / 2
  const cx1 = Math.cos(degToRad * a2) * halfDiameter + x
  const cy1 = -Math.sin(degToRad * a2) * halfDiameter + y
  const cx2 = Math.cos(degToRad * a1) * halfDiameter + x
  const cy2 = -Math.sin(degToRad * a1) * halfDiameter + y

  return isLine
    ? `M${cx1} ${cy1} L ${x} ${y} L ${cx2} ${cy2} L ${x} ${y}Z`
    : `M${x} ${y} ${cx1} ${cy1} A${halfDiameter} ${halfDiameter} 0 0 1 ${cx2} ${cy2}Z`
}

const PlateImages = ({ size = 100, images = [] }) => {
  const sections = images.length

  if (sections === 0) return null

  const sectionAngle = 360 / sections
  const sectionIds = _.range(0, sections).map(i => `section-${Math.random()}-${i}`)

  return (
    <View
      width={size}
      height={size}
      backgroundColor={colors.white10}
      borderRadius={size / 2}
    >
      {sections === 1 ? (
        <RNImage
          source={{ uri: images[0] }}
          width={size}
          height={size}
          borderRadius={size / 2}
        />
      ) : (
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
          <Defs>
            {sectionIds.map((s, index) => (
              <ClipPath key={s} id={s}>
                <Path
                  d={getSectorPath(
                    size / 2,
                    size / 2,
                    size,
                    sectionAngle * index,
                    sectionAngle * (index + 1)
                  )}
                  fill={colors.white}
                />
              </ClipPath>
            ))}
          </Defs>
          {images.map(
            (uri, index) =>
              !!uri && (
                <G key={index} clipPath={`url(#${sectionIds[index]}`}>
                  <Image
                    x="0"
                    y="0"
                    width={size}
                    height={size}
                    preserveAspectRatio="xMidYMid slice"
                    href={{ uri }}
                  />
                  <Path
                    d={getSectorPath(
                      size / 2,
                      size / 2,
                      size,
                      sectionAngle * index,
                      sectionAngle * (index + 1),
                      true
                    )}
                    strokeWidth="2"
                    stroke={colors.white}
                  />
                </G>
              )
          )}
        </Svg>
      )}
    </View>
  )
}

export default PlateImages
