import React, { useMemo } from 'react';
import { Tooltip, Funnel, LabelList, FunnelChart, ResponsiveContainer } from 'recharts';
import { Box, Text } from '@chakra-ui/react';
import theme from '../theme';

export default function FunnelChartCustom({ data }: { data: any[] }) {

    const maxValue = Math.max(...data.map(item => item.value));
    const minValue = Math.min(...data.map(item => item.value));

    const conversionRate = (minValue * 100 / maxValue).toFixed(2);

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => b.value - a.value);
    }, [data]);

    return (
        <Box display={'flex'} justifyContent={'space-around'} alignItems={'center'} flexDirection={'column'} gap={4} bg={theme.colors.gray[800]} p={4} w={['100%', '100%', '50%']}>
            <Text fontSize={'xl'} fontWeight={'bold'}>The conversion rate is: {conversionRate}%</Text>
            <ResponsiveContainer width="100%" height={250}>
                <FunnelChart width={700} height={250}>
                    <Tooltip />
                    <Funnel
                        dataKey="value"
                        data={sortedData}
                        isAnimationActive
                    >
                        <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
                    </Funnel>
                </FunnelChart>
            </ResponsiveContainer>

        </Box>
    )
}
