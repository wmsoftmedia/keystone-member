import { compose } from "recompose";
import { graphql } from "@apollo/react-hoc";
import gql from "graphql-tag";

export const MEMBER_PROFILE = gql`
  query MemberProfile {
    member: currentMember {
      id
      firstName
      lastName
      fullName
      email
      coach: coachByCoachId {
        id
        fullName
      }
      goalSummary
      settings {
        nodes {
          value
          setting: settingBySettingId {
            key
          }
        }
      }
      club {
        id
        name
      }
      goal
      gender
      height
      dateOfBirth
    }
  }
`;

const ALL_SETTINGS = gql`
  query allSettings {
    settings: allSettings {
      nodes {
        key
        name
        type
        options
        default
      }
    }
  }
`;

const settingsQuery = graphql(ALL_SETTINGS, {
  options: () => ({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  }),
  props: ({ data }: any) => {
    const { loading, settings, error } = data;
    return {
      settings: loading || error ? [] : settings.nodes,
    };
  },
});

const profileQuery = graphql(MEMBER_PROFILE, {
  options: {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  },
});

export default compose(
  settingsQuery,
  profileQuery,
);
