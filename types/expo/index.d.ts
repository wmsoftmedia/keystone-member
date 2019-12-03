import { string } from "prop-types";

declare module "expo" {
  export namespace Font {
    function loadAsync(object: { [key: string]: any }): Promise<void>;
  }

  export namespace ScreenOrientation {
    function lockAsync(orientationLock: any): Promise<void>;
    interface Orientation {
      [key: string]: any;
    }
  }
}
