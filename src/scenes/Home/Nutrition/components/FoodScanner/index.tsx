import { LayoutAnimation, StyleSheet } from "react-native";
import { Text, View } from "glamorous-native";
import { compose, lifecycle, withProps, withStateHandlers } from "recompose";
import { withApollo } from "react-apollo";
import { ApolloClient } from "apollo-client";
import React from "react";
import { getOr } from "lodash/fp";

import { BarCodeScanner, BarCodeScannedCallback } from "expo-barcode-scanner";
import { BlurView } from "expo-blur";
import * as Permissions from "expo-permissions";

import { foodItemByBarcodeQuery, IResponse } from "graphql/query/keystoneFoodbank/byBarcode";
// @ts-ignore
import ActivityIndicator from "components/ActivityIndicator";
// @ts-ignore
import CameraGrid from "components/CameraGrid";
// @ts-ignore
import CenterView from "components/CenterView";
// @ts-ignore
import HardwareBackButton from "components/HardwareBackButton";

// @ts-ignore
import colors, { gradients } from "kui/colors";
import { transformKsFoodbank } from "keystone/food_new";
import { IFood } from "keystone/food";
import { IKsFoodbankFoodItem } from "graphql/types";

const RequestingPermission = () => (
  <CenterView backgroundColor={gradients.bg1[0]}>
    <ActivityIndicator style={{ padding: 10 }} />
    <Text color={colors.white}>Requesting camera permission...</Text>
  </CenterView>
);

const Searching = () => (
  <CenterView style={[StyleSheet.absoluteFill]}>
    <ActivityIndicator size="large" style={{ padding: 10 }} />
    <Text color={colors.white}>Searching...</Text>
  </CenterView>
);

interface IBarcodeCbParams {
  type: string;
  barcode: string;
}

interface IScannerProps {
  processing: boolean;
  setProcessing: () => void;
  onBarCodeRead: (params: IBarcodeCbParams) => void;
}

interface IState {
  hasCameraPermission?: boolean;
}

class FoodScanner extends React.Component<IScannerProps, IState, any> {
  public state: Readonly<IState> = {
    hasCameraPermission: void 0,
  };

  public async UNSAFE_componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  public render() {
    const { hasCameraPermission } = this.state;
    const { processing } = this.props;

    if (hasCameraPermission === void 0) {
      return <RequestingPermission />;
    }

    if (hasCameraPermission === false) {
      return (
        <CenterView backgroundColor={gradients.bg1[0]}>
          <Text color={colors.white}>No access to camera.</Text>
        </CenterView>
      );
    }

    return (
      <CenterView style={{ flex: 1 }}>
        <BarCodeScanner
          style={[
            StyleSheet.absoluteFill,
            {
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: gradients.bg1[0],
            },
          ]}
          onBarCodeScanned={this.handleBarCodeRead}
        >
          {processing && <BlurView tint="dark" intensity={100} style={[StyleSheet.absoluteFill]} />}
          <View width={"80%"} height={"50%"}>
            <View backgroundColor={colors.white} opacity={0.05} flex={1} />
            <CameraGrid
              thickness={3}
              color={processing ? colors.green50 : colors.darkBlue80}
              opacity={1}
            />
            {processing && <Searching />}
          </View>
        </BarCodeScanner>
        <HardwareBackButton goBack={false} onBackPress={() => null} />
      </CenterView>
    );
  }

  private handleBarCodeRead: BarCodeScannedCallback = ({ type, data }) => {
    if (!this.props.processing) {
      this.props.setProcessing();
      this.props.onBarCodeRead({ type, barcode: data });
    }
  };
}

interface IProps {
  client: ApolloClient<any>;
  setReady: () => () => void;
  setProcessing: () => () => void;
  onSearchComplete: (param: () => () => void) => (food: IFood) => void;
  onSearchError: (param: () => () => void, barcode: string) => (e: any) => void;
}

const enhanced: any = compose(
  withApollo,
  withStateHandlers(
    { processing: false },
    {
      setProcessing: () => () => ({ processing: true }),
      setReady: () => () => ({ processing: false }),
    },
  ),
  withProps((props: IProps) => {
    const { client, setReady, setProcessing, onSearchComplete, onSearchError } = props;
    const findFoodByBarcode = (barcode: any) => {
      setProcessing();
      return client
        .query<IResponse>(foodItemByBarcodeQuery(barcode))
        .then(
          (response): Voidable<IKsFoodbankFoodItem> =>
            getOr(void 0, "data.foodbankFoodByBarcode.nodes.0", response),
        )
        .then((entry) => {
          if (!entry) {
            throw new Error("not_found");
          }
          onSearchComplete(setReady)(transformKsFoodbank(entry));
        })
        .catch((e: any) => {
          onSearchError(setReady, barcode)(e);
        });
    };

    return {
      onBarCodeRead: ({ barcode }: any) => findFoodByBarcode(barcode),
    };
  }),
  lifecycle({
    componentWillReceiveProps() {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    },
  }),
);

export default enhanced(FoodScanner);
