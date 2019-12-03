import gql from "graphql-tag"

export default {
  full: gql`
    fragment WorkoutTemplateFull on WorkoutTemplate {
      id
      name
      version
      updatedAt
      phaseNum
      notes
      duration
      difficulty
      setMap
    }
  `,
  min: gql`
    fragment WorkoutTemplateMin on WorkoutTemplate {
      id
      name
      version
      updatedAt
      phaseNum
      duration
      difficulty
      setMap
    }
  `,
  withModel: gql`
    fragment WorkoutTemplateModel on WorkoutTemplate {
      id
      name
      notes
      version
      model: sequence
      updatedAt
      phaseNum
      duration
      difficulty
      setMap
    }
  `
}
