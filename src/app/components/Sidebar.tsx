'use client';

import { Box, Flex, Link, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';

export default function Sidebar() {
    const bgColor = useColorModeValue('gray.300', 'gray.800');
    const linkHoverBg = useColorModeValue('gray.200', 'gray.700');
    return (
        <Box bg={bgColor} w="250px" h="100vh" p="4">
            <Flex direction="column" justifyContent={'space-between'} h="100%">
                <Box>
                    <Flex direction="column">
                        <Link as={NextLink} href="/" p="2" _hover={{ bg: linkHoverBg }}>Dashboard</Link>
                        <Link as={NextLink} href="/emit-events" p="2" _hover={{ bg: linkHoverBg }}>Emit Events</Link>
                        <Link as={NextLink} href="/config" p="2" _hover={{ bg: linkHoverBg }}>Config</Link>
                    </Flex>
                </Box>
                <ThemeSwitcher />
            </Flex>

        </Box>
    );
}
