'use client';

import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Button, useColorMode } from '@chakra-ui/react';

export default function ThemeSwitcher() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Button onClick={toggleColorMode} mt="4" w={'fit-content'} size="sm" variant="outline" p={2}>
            {colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
        </Button>
    );
}