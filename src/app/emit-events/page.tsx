'use client';

import { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Text, useToast, VStack } from '@chakra-ui/react';
import { Metric } from '../types/Metric';

const INITIAL_STATE = {
    id: undefined,
    created_at: '',
    name: '',
    value: '',
    props: '',
    account: '',
};

export default function EmitEventsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [configs, setConfigs] = useState<any[]>([]);
    const [formData, setFormData] = useState<Metric>(INITIAL_STATE);

    const toast = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/metrics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    created_at: formData?.created_at || new Date().toISOString(),
                    name: formData?.name,
                    value: formData?.value,
                    props: formData?.props || null,
                    account: formData?.account,
                }),
            });

            const result = await response.json();
            if (result.error) {
                console.error('Error sending metric:', result.error);
                toast({
                    title: `Error sending metric`,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                setFormData(INITIAL_STATE);
                toast({
                    title: `Success! Metric sent successfully`,
                    status: "success",
                    duration: 3000,

                })
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getAccountsAvailables = async () => {
        const response = await fetch('/api/config');
        const result = await response.json();
        setConfigs(result.data);
    }

    useEffect(() => {
        getAccountsAvailables();
    }, []);


    return <Box p="6">
        <Text fontSize={"2xl"} mb={4}>Emit Events Page</Text>
        <VStack as="form" spacing="4" onSubmit={handleSubmit}>
            <FormControl w={"80%"}>
                <FormLabel>Creation Date</FormLabel>
                <Input
                    type="datetime-local"
                    name="created_at"
                    value={formData?.created_at}
                    onChange={handleChange}
                    placeholder="Enter creation date (optional)"
                />
            </FormControl>

            <FormControl isRequired w={"80%"}>
                <FormLabel>Name</FormLabel>
                <Input
                    type="text"
                    name="name"
                    value={formData?.name}
                    onChange={handleChange}
                    placeholder="Enter the event name"
                />
            </FormControl>

            <FormControl isRequired w={"80%"}>
                <FormLabel>Value</FormLabel>
                <Input
                    type="text"
                    name="value"
                    value={formData?.value}
                    onChange={handleChange}
                    placeholder="Enter the event value"
                />
            </FormControl>

            {/* <FormControl w={"80%"}>
                <FormLabel>Props</FormLabel>
                <Textarea
                    name="props"
                    value={formData?.props}
                    onChange={handleChange}
                    placeholder="Enter additional properties (optional)"
                />
            </FormControl> */}

            <FormControl isRequired w={"80%"}>
                <FormLabel>Account</FormLabel>
                <Select value={formData?.account} onChange={handleChange} name='account'>
                    <option value="">Select an account</option>
                    {configs.map((config) => (
                        <option key={config.id} value={config.id}>
                            {config.name}
                        </option>
                    ))}
                </Select>

            </FormControl>

            <Button type="submit" colorScheme="blue" isLoading={isLoading}>
                Send Metric
            </Button>
        </VStack>
    </Box>
}




