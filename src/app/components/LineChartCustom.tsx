import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Metric } from '../types/Metric';
import { Box } from '@chakra-ui/react';
import { formatDate } from '../utils/utils';
import { COLORS } from '../types/Constants';
import theme from '../theme';


export default function LineChartCustom({ data, setDataSelected }: { data: Metric[], setDataSelected: (data: any) => void }) {
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


    return (
        <Box py="4" px="0" display={'flex'} justifyContent={'center'} alignItems={'center'} bg={theme.colors.gray[800]} p={4}>
            <ResponsiveContainer width="80%" height={600}>
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
                    onClick={(e: any) => {
                        setDataSelected(e.activePayload);
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="created_at" tickFormatter={(value) => new Date(value).toLocaleDateString()} type="category"
                        allowDuplicatedCategory={false} />
                    <YAxis domain={[Math.round(min * 0.9), Math.round(max * 1.1)]} interval={"preserveStartEnd"} allowDataOverflow={false}
                        scale="auto"
                        type="number" />
                    <Legend />
                    <Tooltip content={<CustomTooltip />} />
                    {uniqueKeys.map((key, index) => (
                        <Area
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={COLORS[index % COLORS.length]}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>

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
