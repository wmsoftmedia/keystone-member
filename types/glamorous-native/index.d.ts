import { Component } from "glamorous-native";
import { ImageStyle, TextProps, TextStyle, ViewProps, ViewStyle } from "react-native";

declare module "glamorous-native" {
  export type GTextProps = TextProps | TextStyle;
  export type GViewProps = ViewProps | ViewStyle;

  const Text: Component<GTextProps>;
  const View: Component<GViewProps>;
  const TextInput: Component<TextProps | TextStyle | ViewStyle | ImageStyle>;
}
