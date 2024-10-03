import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { Metric } from '../types/Metric';
import { Box } from '@chakra-ui/react';
import { formatDate } from '../utils/utils';


export default function Chart({ data }: { data: Metric[] }) {
    const min = Math.round(Math.min(...data?.map((metric) => metric.value)) * 0.9);
    const max = Math.round(Math.max(...data?.map((metric) => metric.value)) * 1.1);
    return (
        <Box py="4" px="4">
            <LineChart
                width={500}
                height={400}
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="created_at" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                <YAxis domain={[min, max]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </LineChart>
        </Box>
    );
}


const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: { value: number }[], label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <Box p="2" color="white" bg="gray.800" borderRadius="lg">
                <p>{`Date: ${label ? formatDate(label) : ''}`}</p>
                <p>{`Value: ${payload[0].value}`}</p>
            </Box>
        );
    }
}
