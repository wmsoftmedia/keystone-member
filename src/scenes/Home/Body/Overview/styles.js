import { StyleSheet } from "react-native"
import colors from "../../../../colors"

export default StyleSheet.create({
  swiperPagination: {
    width: "20%",
    justifyContent: "center"
  },
  stats: {
    flex: 1,
    maxWidth: "80%",
    flexWrap: "wrap",
    flexDirection: "row",
    alignSelf: "flex-end"
  },
  subtitleText: {
    color: colors.textLight,
    paddingHorizontal: 8,
    fontSize: 24,
    fontWeight: "300"
  },
  titleLine: {
    width: "100%",
    height: 0.5,
    backgroundColor: colors.white
  },
  titleText: {
    fontSize: 42,
    fontWeight: "600",
    color: colors.textLight,
    paddingHorizontal: 8
  },
  sectionHeader: {},
  item: {
    padding: 10,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  itemText: {
    fontSize: 18
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  indicators: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginRight: 16
  },
  swipeout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  swipeoutText: {
    fontSize: 16,
    color: colors.white
  },
  addIconContainer: { marginRight: 8, paddingHorizontal: 8 }
})
