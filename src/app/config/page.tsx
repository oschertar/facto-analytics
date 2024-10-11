'use client'

import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ModalCustom from "../components/Modal";
import { useConfigApi } from "../hooks/useConfigApi";
import { Config } from "../types/Config";

export default function ConfigPage() {
    const { configs, getAccountsAvailables, updateConfig, createAccount } = useConfigApi();
    const { isOpen: isOpenCustomModal, onOpen: onOpenCustomModal, onClose: onCloseCustomModal } = useDisclosure();
    const [name, setName] = useState('');
    const toast = useToast();

    const handleUpdateConfig = async (config: Config) => {
        const result = await updateConfig(config);
        if (result.error) {
            toast({
                title: `Error updating config`,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: `Config updated successfully`,
                status: "success",
                duration: 3000,
            });
        }
    }

    const submitForm = async () => {
        const result = await createAccount(name);
        if (result.error) {
            toast({
                title: `Error creating new account`,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            setName('');
            toast({
                title: `Account created successfully`,
                status: "success",
                duration: 3000,
            });
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
                                <Td><Button onClick={() => handleUpdateConfig(config)}>{config.enabled ? <CheckIcon color={"#2ecc71"} /> : <CloseIcon />}</Button></Td>
                            </Tr>
                        ))}
                    </Tbody>

                </Table>
            </TableContainer>
            : null}
        <ModalCustom modalTitle={'Add new account'} isOpen={isOpenCustomModal} onClose={onCloseCustomModal} onSubmit={submitForm}>
            <Box>
                <Text>Add new account</Text>
                <Input placeholder='Account name' value={name} onChange={(e) => setName(e.target.value)} />
            </Box>
        </ModalCustom>
    </Box>;
}
