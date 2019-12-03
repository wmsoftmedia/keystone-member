import React from "react"

export default Component => {
  return (
    // eslint-disable-next-line react/display-name
    class extends React.Component {
      constructor(props) {
        super(props)
        props.loadData()
      }

      render() {
        return <Component {...this.props} />
      }
    }
  )
}
