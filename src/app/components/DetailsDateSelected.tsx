import React from 'react'
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import PieChartCustom from './PieChartCustom'
import FunnelChart from './FunnelChart'
import { formatDate } from '../utils/utils';
import theme from '../theme';

export default function DetailsDateSelected({ data }: { data: any[] }) {
    const bgColor = useColorModeValue(theme.colors.gray[200], theme.colors.gray[800]);
    return (

        <Box>
            {data?.length ? <Box>
                <Text fontWeight={'bold'} fontSize={'2xl'} mt={4} mb={4}>
                    Details for the date {formatDate(data[0].payload.created_at)}
                </Text>
                <Flex gap={8}>
                    <PieChartCustom data={data} bgColor={bgColor} />
                    <FunnelChart data={data} bgColor={bgColor} />
                </Flex>
            </Box> : null}
        </Box>
    )
}
