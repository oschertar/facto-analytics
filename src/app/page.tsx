'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Spinner, Text, Input, Flex, Select } from '@chakra-ui/react';
import Chart from './components/Chart';
import { Metric } from './types/Metric';

const Dashboard = () => {
  const [data, setData] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterName, setFilterName] = useState('');
  const [typeNames, setTypeNames] = useState<string[]>([]);

  const fetchTypeNames = async () => {
    const response = await fetch('/api/getNameMetrics');
    const result = await response.json();
    setTypeNames(result);

  };

  const fetchData = async () => {
    setLoading(true);

    const paramsQuery = new URLSearchParams({});

    try {
      const query = '/api/getMetrics';


      if (fromDate) {
        paramsQuery.set('from', fromDate);
      }

      if (toDate) {
        paramsQuery.set('to', toDate);
      }

      if (filterName) {
        paramsQuery.set('name', filterName);
      }

      const response = await fetch(`${query}?${paramsQuery.toString()}`);
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

  const handleSubmit = () => {
    fetchData();

  };

  useEffect(() => {
    fetchTypeNames();
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <Box p="4">
      <Text fontSize="xl" mb="4">Home Page</Text>


      <Flex mb="4" alignItems="flex-end" gap={4}>
        <Box>
          <Text>From Date:</Text>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={toDate}
          />
        </Box>
        <Box>
          <Text>To Date:</Text>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate}
          />
        </Box>
        <Box>
          <Text>Type:</Text>
          <Select onChange={(e) => setFilterName(e.target.value)} value={filterName}>
            <option value="">Select name</option>
            {typeNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}

          </Select>
        </Box>
        <Button onClick={handleSubmit} colorScheme="blue">
          Submit
        </Button>
      </Flex>

      <Box display={"flex"}>
        <Chart data={data} />
      </Box>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
};

export default Dashboard;
