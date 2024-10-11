'use client';

import { Box, Button, FormControl, FormLabel, Input, Select, Text, useToast, VStack } from '@chakra-ui/react';
import { useEmitEvents } from '../hooks/useEmitEvents';

export default function EmitEventsPage() {
    const { isLoading, configs, formData, handleChange, handleSubmit } = useEmitEvents();
    const toast = useToast();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();
        if (result.error) {
            console.error('Error sending metric:', result.error);
            toast({
                title: `Error sending metric`,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: `Success! Metric sent successfully`,
                status: "success",
                duration: 3000,
            });
        }
    };

    return (
        <Box p="6">
            <Text fontSize={"2xl"} mb={4}>Emit Events Page</Text>
            <VStack as="form" spacing="4" onSubmit={onSubmit}>
                <FormControl w={"80%"}>
                    <FormLabel>Creation Date</FormLabel>
                    <Input
                        type="date"
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
    );
}




