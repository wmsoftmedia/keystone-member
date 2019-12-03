import { graphql } from "react-apollo"
import gql from "graphql-tag"
import moment from "moment"

import { DATE_FORMAT_GRAPHQL } from "keystone/constants"
import { WATER_VOLUME } from "graphql/query/foodJournal/waterVolume"
import { genMutationId } from "keystone"

const SAVE_JOURNAL_WATER = gql`
  mutation SaveJournalWater($input: SaveJournalWaterVolumeInput!) {
    saveJournalWaterVolume(input: $input) {
      clientMutationId
      volume
    }
  }
`

export default graphql(SAVE_JOURNAL_WATER, {
  props: ({ mutate }) => {
    return {
      saveJournalWaterVolume: ({ date, volume }) => {
        const volumeInt = Math.round(+volume || 0)
        const clientMutationId = genMutationId()
        const formattedDate = (date ? moment(date) : moment()).format(DATE_FORMAT_GRAPHQL)

        return mutate({
          variables: {
            clientMutationId,
            input: {
              day: date,
              volume: volumeInt
            },
            __offline__: true
          },
          optimisticResponse: {
            saveJournalWaterVolume: {
              __typename: "SaveJournalWaterVolumePayload",
              clientMutationId,
              volume: volumeInt
            }
          },
          refetchQueries: [
            {
              query: WATER_VOLUME,
              variables: { __offline__: true, date: formattedDate }
            }
          ]
        })
      }
    }
  }
})
