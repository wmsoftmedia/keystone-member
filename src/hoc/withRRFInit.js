import React from "react"

export const withRRFInit = ({ loadData }) => Component => {
  return (
    // eslint-disable-next-line react/display-name
    class extends React.Component {
      constructor(props) {
        super(props)
        loadData(props)
      }

      componentWillUpdate(nextProps) {
        loadData(nextProps)
      }

      render() {
        return <Component {...this.props} />
      }
    }
  )
}
