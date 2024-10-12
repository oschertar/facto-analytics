import React, { useMemo } from 'react';
import { Tooltip, Funnel, LabelList, FunnelChart, ResponsiveContainer } from 'recharts';
import { Box, Text, useColorMode } from '@chakra-ui/react';

export default function FunnelChartCustom({ data, bgColor }: { data: any[], bgColor: string }) {
    const theme = useColorMode();
    const { colorMode } = theme;

    const maxValue = Math.max(...data.map(item => item.value));
    const minValue = Math.min(...data.map(item => item.value));
    const conversionRate = (minValue * 100 / maxValue).toFixed(2);

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => b.value - a.value);
    }, [data]);

    return (
        <Box display={'flex'} justifyContent={'space-around'} alignItems={'center'} flexDirection={'column'} gap={4} bg={bgColor} p={4} w={['100%', '100%', '50%']}>
            <Text fontSize={'xl'} fontWeight={'bold'}>The conversion rate is: {conversionRate}%</Text>
            <ResponsiveContainer width="100%" height={250}>
                <FunnelChart width={700} height={250}>
                    <Tooltip />
                    <Funnel
                        dataKey="value"
                        data={sortedData}
                        isAnimationActive
                    >
                        <LabelList position="right" fill={colorMode === 'dark' ? '#fff' : '#000'} stroke="none" dataKey="name" />
                    </Funnel>
                </FunnelChart>
            </ResponsiveContainer>

        </Box>
    )
}
