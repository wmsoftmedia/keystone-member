import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

const SUBMIT_BARCODE_REQUEST = gql`
  mutation SubmitBarcodeRequest($input: SubmitBarcodeRequestInput!) {
    submitBarcodeRequest(input: $input) {
      clientMutationId
      frontUrl
      factsUrl
    }
  }
`

export default graphql(SUBMIT_BARCODE_REQUEST, {
  props: ({ mutate }) => {
    return {
      submitBarcodeRequest: barcode => {
        return mutate({
          variables: { input: { barcode }, __offline__: true }
        })
      }
    }
  }
})
