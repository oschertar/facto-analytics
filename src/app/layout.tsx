import type { Metadata } from "next";
import "./globals.css";
import { ChakraProviderWrapper } from "./chakra-provider";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Factorial Analyics",
  description: "Show your analytics in a beautiful way",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChakraProviderWrapper>
          <Flex>
            <Sidebar />
            <Box flex="1" p="4">
              {children}
            </Box>
          </Flex>
        </ChakraProviderWrapper>
      </body>
    </html>
  );
}
