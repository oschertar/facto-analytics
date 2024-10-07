import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import PieChartCustom from './PieChartCustom'
import FunnelChart from './FunnelChart'
import { formatDate } from '../utils/utils';

export default function DetailsDateSelected({ data }: { data: any[] }) {
    return (

        <Box>
            {data?.length ? <Box>
                <Text fontWeight={'bold'} fontSize={'2xl'} mt={4} mb={4}>
                    Details for the date {formatDate(data[0].payload.created_at)}
                </Text>
                <Flex gap={8}>
                    <PieChartCustom data={data} />
                    <FunnelChart data={data} />
                </Flex>
            </Box> : null}
        </Box>
    )
}
