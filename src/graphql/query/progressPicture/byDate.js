import { compose, withProps } from "recompose"
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import moment from "moment"
import _ from "lodash/fp"

import { DATE_FORMAT_GRAPHQL } from "keystone/constants"

export const PROGRESS_PICTURE_BY_DATE = gql`
  query ProgressPicturesByDate($date: NaiveDate!) {
    progressPicturesByDate(date: $date) {
      totalCount
      nodes {
        id
        localPath
        userId
        isPrivate
        comment
        originalUrl
        previewUrl
      }
    }
  }
`

const query = graphql(PROGRESS_PICTURE_BY_DATE, {
  options: ({ date }) => ({
    name: "ProgressPicturesByDate",
    fetchPolicy: "cache-and-network",
    variables: { __offline__: true, date: moment(date).format(DATE_FORMAT_GRAPHQL) }
  })
})

const withProgressPicturesByDate = compose(
  query,
  withProps(props => {
    return {
      pictures: _.getOr([], "data.progressPicturesByDate.nodes", props) || []
    }
  })
)

export default withProgressPicturesByDate
