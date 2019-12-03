import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { genMutationId } from "keystone"

const UPDATE_SETTING = gql`
  mutation UpsertSetting($key: String!, $value: String!) {
    upsertUserSetting(input: { key: $key, value: $value }) {
      userSetting {
        value
        setting: settingBySettingId {
          key
        }
      }
    }
  }
`

const CURRENT_MEMBER = gql`
  query CurrentMember {
    currentMember {
      id
      settings {
        nodes {
          value
          setting: settingBySettingId {
            key
          }
        }
      }
    }
  }
`

export default graphql(UPDATE_SETTING, {
  props: ({ mutate }) => {
    return {
      submitSetting: key => value => {
        return mutate({
          variables: {
            key,
            value,
            clientMutationId: genMutationId(),
            __offline__: true
          },
          optimisticResponse: {
            upsertUserSetting: {
              __typename: "UpsertUserSettingPayload",
              userSetting: {
                __typename: "UserSetting",
                setting: {
                  __typename: "Setting",
                  key
                },
                value
              }
            }
          },
          update: (
            proxy,
            {
              data: {
                upsertUserSetting: { userSetting }
              }
            }
          ) => {
            const data = proxy.readQuery({ query: CURRENT_MEMBER })
            const ind = data.currentMember.settings.nodes.findIndex(
              ({ setting }) => setting.key === key
            )
            if (ind !== -1) {
              data.currentMember.settings.nodes[ind] = userSetting
            } else {
              data.currentMember.settings.nodes.push(userSetting)
            }
            proxy.writeQuery({ query: CURRENT_MEMBER, data })
          }
        })
      }
    }
  }
})
