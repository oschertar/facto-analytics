'use client';

import { ChakraProvider } from '@chakra-ui/react';

export function ChakraProviderWrapper({ children }: { children: React.ReactNode }) {
    return <ChakraProvider>{children}</ChakraProvider>;
}
