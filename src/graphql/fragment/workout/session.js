import gql from "graphql-tag"

export default {
  full: gql`
    fragment WorkoutSessionFull on WorkoutSession {
      id
      date
      body
      isCompleted
      workoutTemplate {
        id
        name
        setMap
        duration
        difficulty
      }
      meta {
        volume
        calories
        distance
        performance
        difficulty
        notes
      }
    }
  `,
  min: gql`
    fragment WorkoutSessionMin on WorkoutSession {
      id
      date
      isCompleted
      workoutTemplate {
        id
        name
        setMap
        duration
        difficulty
      }
      meta {
        volume
        calories
        distance
        performance
        difficulty
        notes
      }
    }
  `
}
