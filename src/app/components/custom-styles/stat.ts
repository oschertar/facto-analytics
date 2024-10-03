import { statAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(statAnatomy.keys);

const baseStyle = definePartsStyle({
  label: {
    fontWeight: "light",
    color: "#dadada",
  },
  helpText: {
    fontSize: "sm",
    color: "#dadada",
    fontWeight: "light",
  },
  container: {
    bg: "gray.800",
    borderRadius: "md",
    p: 3,
    color: "white",
  },
  icon: {},
  number: {},
});

export const statTheme = defineMultiStyleConfig({ baseStyle });
