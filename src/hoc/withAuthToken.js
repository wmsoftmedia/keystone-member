import { getToken } from "auth"
import { compose, withState, lifecycle, branch, renderNothing } from "recompose"

export const withDelayedAuthToken = compose(
  withState("authToken", "setAuthToken", null),
  lifecycle({
    componentDidMount() {
      getToken()
        .then(this.props.setAuthToken)
        .catch(e => console.error("Could not get auth token", e.message))
    }
  })
)

export default compose(
  withDelayedAuthToken,
  branch(props => props.authToken === null, renderNothing)
)
