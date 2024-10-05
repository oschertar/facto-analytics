import React from 'react';
import { Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { Metric } from '../types/Metric';
import { Box, Text } from '@chakra-ui/react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;

export default function PieChartCustom({ data }: { data: Metric[] }) {


    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: { cx: number, cy: number, midAngle: number, innerRadius: number, outerRadius: number, percent: number }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const total = data.reduce((acc, obj) => acc + obj.value, 0);

    return (
        <Box w={'50%'}>
            <Text fontWeight={'bold'}>
                Total of events: {total}
            </Text>
            <ResponsiveContainer width={"100%"} height={600}>
                <PieChart width={600} height={600}>
                    <Legend />
                    <Tooltip />
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={140}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>

                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
}


