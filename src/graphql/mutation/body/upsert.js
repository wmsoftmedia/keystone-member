import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import moment from "moment"

import { BODY_TIMELINE } from "graphql/query/body/timeline"
import { DATE_FORMAT_GRAPHQL } from "keystone/constants"
import { LAST_BODY_METRICS_BY_DATE } from "graphql/query/body/lastMetricsByDate"
import { METRICS_BY_DATE } from "graphql/query/body/byDate"

const SAVE_BODY_METRICS = gql`
  mutation SaveBodyMetrics($input: SaveBodyMeasurementInput!) {
    saveBodyMetrics(input: $input) {
      clientMutationId
      metrics {
        date
        bodyWeight
        bodyFatPercentage
        bodyFatMass
        skeletalMuscleMass
        circumference {
          neck
          chest
          abdomen
          hip
          rightArm
          rightThigh
        }
        sleepHours
        bloodPressure {
          systole
          diastole
        }
        menstrualDay
        heartRate
        heartRateVar
        bodyTemp
      }
    }
  }
`

export default graphql(SAVE_BODY_METRICS, {
  props: ({ mutate }) => {
    return {
      saveBodyMetrics: ({
        userId,
        date,
        bodyWeight,
        bodyFatPercentage,
        bodyFatMass,
        skeletalMuscleMass,
        circumference,
        sleepHours,
        bloodPressure,
        menstrualDay,
        heartRate,
        heartRateVar,
        bodyTemp
      }) => {
        return mutate({
          variables: {
            input: {
              userId,
              date: moment(date).format(DATE_FORMAT_GRAPHQL),
              bodyWeight,
              bodyFatPercentage,
              bodyFatMass,
              skeletalMuscleMass,
              circumference,
              sleepHours,
              bloodPressure,
              menstrualDay,
              heartRate,
              heartRateVar,
              bodyTemp
            },
            __offline__: true
          },
          refetchQueries: [
            {
              query: METRICS_BY_DATE,
              variables: {
                __offline__: true,
                date: moment(date).format(DATE_FORMAT_GRAPHQL)
              }
            },
            {
              query: LAST_BODY_METRICS_BY_DATE,
              variables: {
                __offline__: true,
                date: moment().format(DATE_FORMAT_GRAPHQL),
                keys: [
                  "BODY_WEIGHT",
                  "BODY_FAT_PERCENTAGE",
                  "BODY_FAT_MASS",
                  "SKELETAL_MUSCLE_MASS",
                  "CIRCUMFERENCE",
                  "SLEEP_HOURS",
                  "BLOOD_PRESSURE",
                  "MENSTRUAL_DAY",
                  "HEART_RATE",
                  "HEART_RATE_VAR",
                  "BODY_TEMP"
                ]
              }
            },
            {
              query: BODY_TIMELINE,
              variables: { __offline__: true, offset: 0, first: 5 }
            }
          ]
        })
      }
    }
  }
})
