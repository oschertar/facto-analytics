'use client';

import { Box, Flex, Icon, Link, Text, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';
import { MdDashboard, MdEvent, MdSettings } from 'react-icons/md'

export default function Sidebar() {
    const bgColor = useColorModeValue('gray.300', 'gray.800');
    const linkHoverBg = useColorModeValue('gray.200', 'gray.700');
    return (
        <Box bg={bgColor} w="250px" h="100vh" p="4" position="fixed" left="0" top="0">
            <Flex direction="column" justifyContent={'space-between'} h="100%">
                <Box>
                    <Flex direction="column">
                        <Link as={NextLink} href="/" p="2" _hover={{ bg: linkHoverBg }} display="flex" alignItems="center">
                            <Icon as={MdDashboard} mr={2} />
                            <Text>Dashboard</Text>
                        </Link>
                        <Link as={NextLink} href="/emit-events" p="2" _hover={{ bg: linkHoverBg }} display="flex" alignItems="center">
                            <Icon as={MdEvent} mr={2} />
                            <Text>Emit Events</Text>
                        </Link>
                        <Link as={NextLink} href="/config" p="2" _hover={{ bg: linkHoverBg }} display="flex" alignItems="center">
                            <Icon as={MdSettings} mr={2} />
                            <Text>Config</Text>
                        </Link></Flex>
                </Box>
                <ThemeSwitcher />
            </Flex>

        </Box>
    );
}
