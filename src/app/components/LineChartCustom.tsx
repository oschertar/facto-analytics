import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend } from 'recharts';
import { Metric } from '../types/Metric';
import { Box } from '@chakra-ui/react';
import { formatDate } from '../utils/utils';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F'];

export default function LineChartCustom({ data }: { data: Metric[] }) {
    const uniqueKeys: string[] = [];

    data.flatMap(obj => Object.keys(obj)).forEach(key => {
        if (key !== 'created_at' && !uniqueKeys.includes(key)) {
            uniqueKeys.push(key);
        }
    });

    const { min, max } = data.reduce((acc, obj) => {
        const values = Object.values(obj).filter(val => typeof val === 'number');
        return {
            min: Math.min(acc.min, ...values),
            max: Math.max(acc.max, ...values),
        };
    }, { min: Infinity, max: -Infinity });

    console.log(min, max);

    return (
        <Box py="4" px="0">
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
                <YAxis domain={[Math.round(min * 0.9), Math.round(max * 1.1)]} />
                <Legend />
                <Tooltip content={<CustomTooltip />} />
                {uniqueKeys.map((key, index) => (
                    <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={COLORS[index % COLORS.length]}
                        fill={COLORS[index % COLORS.length]}
                    />
                ))}
            </LineChart>
        </Box>
    );
}


const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: { value: number, name: string }[], label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <Box p="2" color="white" bg="gray.800" borderRadius="lg">
                <p>{`Date: ${label ? formatDate(label) : ''}`}</p>
                {payload.map(({ value, name }) => (
                    <p key={name}>
                        <strong>{name}:</strong> {value}
                    </p>
                ))}
            </Box>
        );
    }
}
