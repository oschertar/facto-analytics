'use client'

import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ModalCustom from "../components/Modal";

export default function ConfigPage() {
    const [configs, setConfigs] = useState<any[]>([]);
    const { isOpen: isOpenCustomModal, onOpen: onOpenCustomModal, onClose: onCloseCustomModal } = useDisclosure();
    const [name, setName] = useState('');
    const toast = useToast();

    const updateConfig = async (config: any) => {
        const response = await fetch('/api/config', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: config.id,
                enabled: !config.enabled,
            }),
        })

        const result = await response.json();
        if (result.error) {
            toast({
                title: `Error updating config`,
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        } else {

            setConfigs((prevConfigs) =>
                prevConfigs.map((prevConfig) =>
                    prevConfig.id === config.id
                        ? { ...prevConfig, enabled: !config.enabled }
                        : prevConfig
                )
            );
            toast({
                title: `Config updated successfully`,
                status: "success",
                duration: 3000,

            })
        }

    }
    const getAccountsAvailables = async () => {
        const response = await fetch('/api/config');
        const result = await response.json();
        setConfigs(result.data);
    }

    const submitForm = async () => {
        const response = await fetch('/api/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                enabled: true,
            }),
        })
        const result = await response.json();

        if (result.error) {
            toast({
                title: `Error creating new account`,
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        } else {
            setConfigs((prevConfigs) => [...prevConfigs, result.data]);
            setName('')
            toast({
                title: `Account created successfully`,
                status: "success",
                duration: 3000,

            })

        }

        onCloseCustomModal();
    };

    useEffect(() => {
        getAccountsAvailables();
    }, []);

    return <Box>
        <Flex justifyContent={"space-between"}>
            <Text fontSize={"2xl"} mb={4}>Config Page</Text>
            <Button onClick={() => { onOpenCustomModal() }}>Add new account</Button>
        </Flex>

        {configs.length ?
            <TableContainer borderWidth={1} borderRadius={8}>
                <Table variant='striped' size='md'>
                    <TableCaption>Accounts detected in the system</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Id</Th>
                            <Th>Account Name</Th>
                            <Th>Status</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {configs.map((config) => (
                            <Tr key={config.id}>
                                <Td>{config.id}</Td>
                                <Td>{config.name}</Td>
                                <Td><Button onClick={() => updateConfig(config)}>{config.enabled ? <CheckIcon color={"#2ecc71"} /> : <CloseIcon />}</Button></Td>
                            </Tr>
                        ))}
                    </Tbody>

                </Table>
            </TableContainer>
            : null}
        <ModalCustom modalTitle={'Add new account'} isOpen={isOpenCustomModal} onClose={() => { submitForm() }}>
            <Box>
                <Text>Add new account</Text>
                <Input placeholder='Account name' value={name} onChange={(e) => setName(e.target.value)} />
            </Box>
        </ModalCustom>
    </Box>;
}
