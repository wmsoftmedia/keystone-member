import { getMemberId } from "../auth"
import {
  compose,
  withStateHandlers,
  lifecycle,
  branch,
  renderNothing
} from "recompose"

export const withDelayedMemberId = compose(
  withStateHandlers(
    { memberId: null },
    {
      setMemberId: () => memberId => ({ memberId: +memberId })
    }
  ),
  lifecycle({
    componentDidMount() {
      getMemberId()
        .then(this.props.setMemberId)
        .catch(e => console.error("Could not get memberId", e.message))
    }
  })
)

export default compose(
  withDelayedMemberId,
  branch(props => props.memberId === null, renderNothing)
)
