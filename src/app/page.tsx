'use client';

import { useEffect, useState } from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';

const HomePage = () => {
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getMetrics');
        const result = await response.json();

        if (response.ok) {
          setData(result);
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  if (loading) return <Spinner />;

  return (
    <Box p="4">
      <Text fontSize="xl" mb="4">Home Page</Text>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
};

export default HomePage;
