import colors, { gradients } from "kui/colors";
import fonts from "kui/fonts";

export const noBorder = {
  shadowRadius: 0,
  shadowColor: colors.transparent,
  shadowOffset: { height: 0 },
  borderBottomWidth: 0,
  elevation: 0,
};

export const headerStyle = {
  backgroundColor: gradients.bg1[0],
  ...noBorder,
  borderTopColor: "rgba(50,60,68,0.15)",
  borderTopWidth: 2,
  height: 64,
};

export const headerTitleStyle = {
  color: colors.white,
  fontFamily: fonts.montserratSemiBold,
  fontSize: 18,
  lineHeight: 28,
};

export const headerTitleStyleV3 = {
  color: colors.white50,
  fontFamily: fonts.montserratSemiBold,
  fontSize: 18,
  lineHeight: 28,
};

export const cardTopStyle = {
  borderTopRightRadius: 20,
  borderTopLeftRadius: 20,
};

export const boxShadow = {
  shadowOpacity: 0.7,
  shadowColor: colors.black,
  shadowOffset: { width: 10, height: 10 },
  shadowRadius: 30,
};

export default {
  center: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};
