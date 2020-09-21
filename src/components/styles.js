import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  picker: {
    backgroundColor: "#FFF",
    borderRadius: 2,
    position: "absolute",
    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowColor: "#000",
        shadowOpacity: 0.54,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },

  item: {
    textAlign: "left",
  },

  scroll: {
    flex: 1,
    borderRadius: 2,
  },

  scrollContainer: {
    paddingVertical: 8,
  },

  container: {
    paddingVertical: 8,
    borderRadius: 0,
    justifyContent: "center",
  },
});
