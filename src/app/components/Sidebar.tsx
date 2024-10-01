'use client';

import { Box, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Sidebar() {
    return (
        <Box w="250px" bg="gray.100" h="100vh" p="4">
            <Flex direction="column">
                <Link as={NextLink} href="/" p="2" _hover={{ bg: 'gray.200' }}>Dashboard</Link>
                <Link as={NextLink} href="/emit-events" p="2" _hover={{ bg: 'gray.200' }}>Emit Events</Link>
                <Link as={NextLink} href="/config" p="2" _hover={{ bg: 'gray.200' }}>Config</Link>
            </Flex>
        </Box>
    );
}
