import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import PieChartCustom from './PieChartCustom'
import FunnelChart from './FunnelChart'

export default function DetailsDateSelected({ data }: { data: [] }) {
    return (

        <Box>
            {data?.length ? <Box>
                <Text fontWeight={'bold'} fontSize={'xl'}>
                    Details of this date
                </Text>
                <Flex>
                    <PieChartCustom data={data} />
                    <FunnelChart data={data} />
                </Flex>
            </Box> : null}
        </Box>
    )
}
