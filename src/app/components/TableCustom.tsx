import { Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'
import { Metric } from '../types/Metric';

export default function TableCustom({ data }: { data: Metric[] }) {
    return (

        <TableContainer>
            <Table variant='striped'>
                <TableCaption>Imperial to metric conversion factors</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Date</Th>
                        <Th isNumeric>Value</Th>
                    </Tr>
                </Thead>
                {data.length ?
                    <Tbody>
                        {data.map((metric: Metric) => (
                            <Tr key={metric.id}>
                                <Td>{metric.created_at}</Td>
                                <Td isNumeric>{metric.value}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                    : null}
                <Tfoot>
                    <Tr>
                        <Th>Date</Th>
                        <Th isNumeric>Value</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>

    )
}

