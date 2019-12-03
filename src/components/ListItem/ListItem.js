import { TouchableWithoutFeedback, View } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import React from "react"
import styled, { ThemeProvider } from "glamorous-native"

import { PlusIcon } from "kui/icons"
import PropTypes from "prop-types"

import { fontL } from "../Typography"
import { scaleFont } from "../../scalingUnits"

const getStyleOverrides = name => (props, ...rest) => {
  const overrides = props.theme.listItem[name]
  if (typeof overrides === "function") {
    return overrides(props, ...rest)
  }
  return overrides
}

const Container = styled.view(
  {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  props => ({
    height: 46 * props.rows,
    ...getStyleOverrides("container")(props)
  })
)
const Content = styled(p => <View {...p} />)({ flex: 1 }, getStyleOverrides("content"))

const Row = styled(p => <View {...p} />)(
  {
    paddingLeft: 20,
    paddingRight: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
    //flex: 1
  },
  props => ({ ...getStyleOverrides("row")(props) })
)

const Label = styled.text(
  { fontSize: scaleFont(fontL), fontWeight: "500" },
  getStyleOverrides("label")
)

const Arrow = styled.view(
  { width: 38, height: "100%", justifyContent: "center", alignItems: "center" },
  getStyleOverrides("arrow")
)

const ArrowIcon = styled(Ionicons)(
  { fontSize: scaleFont(24) },
  getStyleOverrides("arrowIcon")
)

const ListItemFragments = props => {
  const {
    contentLeft,
    contentRight,
    rows,
    contentTop,
    contentBottom,
    highlighted,
    arrowIconName,
    disableHighlight,
    renderSuffix,
    renderPrefix,
    stackStyle
  } = props

  const hi = !disableHighlight && highlighted
  return [
    <Content key="content">
      {rows === 1 && (
        <Row>
          {renderPrefix && renderPrefix()}
          <Label hi={hi} numberOfLines={1} ellipsizeMode={"tail"}>
            {contentLeft}
          </Label>
          <Label hi={hi} numberOfLines={1} ellipsizeMode={"tail"}>
            {contentRight}
          </Label>
          {renderSuffix && renderSuffix()}
        </Row>
      )}
      {rows === 2 && (
        <View flexDirection="row">
          {renderPrefix && renderPrefix()}
          <View {...stackStyle}>
            <Row key="top">{contentTop}</Row>
            <Row key="bottom">{contentBottom}</Row>
          </View>
          {renderSuffix && renderSuffix()}
        </View>
      )}
    </Content>,
    <Arrow key="arrow" hi={hi}>
      {arrowIconName === "md-add" ? (
        <PlusIcon />
      ) : (
        <ArrowIcon hi={hi} name={arrowIconName} />
      )}
    </Arrow>
  ]
}

ListItemFragments.propTypes = {
  highlighted: PropTypes.bool.isRequired
}

class ListItem extends React.Component {
  state = { highlighted: false }

  render() {
    const { highlighted } = this.state
    const { rows, styleOverrides, disableHighlight, onPress, onLongPress } = this.props
    const hi = !disableHighlight && highlighted
    return (
      <ThemeProvider theme={{ listItem: styleOverrides }}>
        <TouchableWithoutFeedback
          onPressIn={() => this.setState({ highlighted: true })}
          onPressOut={() => this.setState({ highlighted: false })}
          onPress={onPress}
          onLongPress={onLongPress}
        >
          <View>
            <Container hi={hi} rows={rows}>
              <ListItemFragments {...this.props} highlighted={hi} />
            </Container>
          </View>
        </TouchableWithoutFeedback>
      </ThemeProvider>
    )
  }
}

ListItem.defaultProps = {
  rows: 1,
  styleOverrides: {},
  arrowIconName: "ios-arrow-forward",
  disableHighlight: false,
  onPress: () => ({}),
  onLongPress: () => ({})
}

ListItem.propTypes = {
  rows: PropTypes.oneOf([1, 2]),
  contentLeft: PropTypes.node,
  contentRight: PropTypes.node,
  contentTop: PropTypes.node,
  contentBottom: PropTypes.node,
  styleOverrides: PropTypes.object,
  arrowIconName: PropTypes.string,
  disableHighlight: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  renderPrefix: PropTypes.func,
  renderSuffix: PropTypes.func
}

export default ListItem
