'use client';

import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, useToast, VStack } from '@chakra-ui/react';
import { Metric } from '../types/Metric';

export default function EmitEventsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Metric>({
        created_at: '',
        name: '',
        value: 0,
        props: '',
        account: 0,
    });

    const toast = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/postMetric', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    created_at: formData.created_at || new Date().toISOString(),
                    name: formData.name,
                    value: formData.value,
                    props: formData.props || null,
                    account: formData.account,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Metric sent successfully:', result);
                toast({
                    title: `Success!! Metric sent successfully`,
                    status: "success",
                    duration: 3000,

                })
            } else {
                console.error('Error sending metric:', result.error);
                toast({
                    title: `Error sending metric`,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };


    return <Box p="6">
        <h2>New Metric</h2>
        <VStack as="form" spacing="4" onSubmit={handleSubmit}>
            <FormControl>
                <FormLabel>Creation Date</FormLabel>
                <Input
                    type="datetime-local"
                    name="created_at"
                    value={formData.created_at}
                    onChange={handleChange}
                    placeholder="Enter creation date (optional)"
                />
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter the event name"
                />
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Value</FormLabel>
                <Input
                    type="text"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="Enter the event value"
                />
            </FormControl>

            <FormControl>
                <FormLabel>Props</FormLabel>
                <Textarea
                    name="props"
                    value={formData.props}
                    onChange={handleChange}
                    placeholder="Enter additional properties (optional)"
                />
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Account ID</FormLabel>
                <Input
                    type="text"
                    name="account"
                    value={formData.account}
                    onChange={handleChange}
                    placeholder="Enter the account ID"
                />
            </FormControl>

            <Button type="submit" colorScheme="blue" isLoading={isLoading}>
                Send Metric
            </Button>
        </VStack>
    </Box>
}




