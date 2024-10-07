import React from 'react';
import { Tooltip, Funnel, LabelList, FunnelChart } from 'recharts';
import { Box, Text } from '@chakra-ui/react';
import theme from '../theme';

export default function FunnelChartCustom({ data }: { data: any[] }) {

    const maxValue = Math.max(...data.map(item => item.value));
    const minValue = Math.min(...data.map(item => item.value));

    const conversionRate = (minValue * 100 / maxValue).toFixed(2);

    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} gap={4} bg={theme.colors.gray[800]} p={4} w={'50%'}>
            <Text fontSize={'xl'}>The conversion rate is: {conversionRate}%</Text>
            <FunnelChart width={700} height={250}>
                <Tooltip />
                <Funnel
                    dataKey="value"
                    data={data}
                    isAnimationActive
                >
                    <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
                </Funnel>
            </FunnelChart>

        </Box>
    )
}
