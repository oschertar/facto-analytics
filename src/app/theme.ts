import { extendTheme, StyleFunctionProps, ThemeConfig } from "@chakra-ui/react";
import { statTheme } from "./components/custom-styles/stat";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.700" : "gray.100",
        color: props.colorMode === "dark" ? "white" : "black",
      },
    }),
  },
  components: { Stat: statTheme },
});

export default theme;
