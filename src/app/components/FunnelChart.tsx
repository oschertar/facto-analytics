import React from 'react';
import { Tooltip, ResponsiveContainer, Funnel, LabelList, FunnelChart, Legend } from 'recharts';
import { Box } from '@chakra-ui/react';
import { Metric } from '../types/Metric';

export default function FunnelChartCustom({ data }: { data: Metric[] }) {
    console.log(data);
    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>

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
