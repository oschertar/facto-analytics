import { statAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(statAnatomy.keys);

const baseStyle = definePartsStyle((props) => ({
  label: {
    fontWeight: "light",
    color: props.colorMode === "dark" ? "#dadada" : "gray.600",
  },
  helpText: {
    fontSize: "sm",
    color: props.colorMode === "dark" ? "#dadada" : "gray.600",
    fontWeight: "light",
  },
  container: {
    bg: props.colorMode === "dark" ? "gray.800" : "white",
    borderRadius: "md",
    p: 3,
    color: props.colorMode === "dark" ? "white" : "gray.800",
    boxShadow: props.colorMode === "light" ? "sm" : "none",
  },
  icon: {},
  number: {
    color: props.colorMode === "dark" ? "white" : "gray.800",
  },
}));

export const statTheme = defineMultiStyleConfig({ baseStyle });
