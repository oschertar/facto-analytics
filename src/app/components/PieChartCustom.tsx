import React from 'react';
import { Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { Metric } from '../types/Metric';
import { Box, Text } from '@chakra-ui/react';
import { COLORS } from '../types/Constants';
import theme from '../theme';


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
        <Box py="4" px="0" display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} bg={theme.colors.gray[800]} p={4} w={'50%'}>
            <Text fontWeight={'bold'} fontSize={"xl"}>
                Total of events: {total}
            </Text>
            <ResponsiveContainer width={"100%"} height={500}>
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


