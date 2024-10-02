import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Metric } from '../types/Metric';
import { Box } from '@chakra-ui/react';


export default function Chart({ data }: { data: Metric[] }) {
    return (
        <Box p="4">
            <AreaChart
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
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="name" stroke="red" fill="blue" />
            </AreaChart>
        </Box>
    );
}

