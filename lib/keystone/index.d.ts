import { MomentInput } from "moment";
import { NavigationProp } from "react-navigation";

export declare function round(num: number): number;
export declare function getNavigationParam(navigation: NavigationProp<any>, key: string): any;
export declare function gqlDate(date: MomentInput): string;
export declare function today(format?: string): string;

export interface IMacrosParam {
  protein?: number | string;
  fat?: number | string;
  carbs?: number | string;
}
export declare function macros(macros: IMacrosParam): IMacrosParam;
